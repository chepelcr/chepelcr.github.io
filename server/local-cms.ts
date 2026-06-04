import type { Express, Request, Response, NextFunction } from "express";
import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// Repo + content roots (absolute, forward-slash friendly)
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const CLIENT_SRC = path.join(REPO_ROOT, "client", "src");
const CONTENT_DIR = path.join(CLIENT_SRC, "content");
const TRANSLATIONS_DIR = path.join(CLIENT_SRC, "translations");
const PUBLIC_DIR = path.join(REPO_ROOT, "client", "public");
const MEDIA_DIR = path.join(PUBLIC_DIR, "media");

// Whitelists / limits
const JSON_FILENAME = /^[a-zA-Z0-9_-]+\.json$/;
const ASSET_FILENAME = /^[a-zA-Z0-9_-]+\.(png|jpe?g|gif|webp|svg|avif|mp4|webm|ogg|mp3|wav)$/i;
const TRANSLATION_FILES = new Set(["es.json", "en.json"]);
const MAX_ASSET_BYTES = 25 * 1024 * 1024; // 25MB

// Dirs that the CMS is allowed to touch (relative to repo root, for git ops)
const TRACKED_PATHS = [
  "client/src/content",
  "client/src/translations",
  "client/public",
];

/**
 * Reject any request whose Host is not a loopback / *.local address.
 * Returns true when the request was rejected (handler should stop).
 */
function rejectIfRemote(req: Request, res: Response): boolean {
  const hostHeader = (req.headers.host || "").toString();
  const hostname = hostHeader.split(":")[0].trim().toLowerCase();
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local");
  if (!isLocal) {
    res.status(403).json({ ok: false, message: "Forbidden: local-only endpoint" });
    return true;
  }
  return false;
}

/**
 * Ensure that `resolved` lives directly inside `dir` (no traversal).
 * `basename` is the already-validated filename.
 */
function isPathSafe(dir: string, basename: string, resolved: string): boolean {
  return resolved === path.join(dir, basename);
}

export function registerLocalCmsRoutes(app: Express): void {
  // POST /__local/content — write a content/translation JSON file
  app.post("/__local/content", async (req: Request, res: Response) => {
    if (rejectIfRemote(req, res)) return;
    try {
      const { filename, data } = req.body ?? {};

      if (typeof filename !== "string" || !JSON_FILENAME.test(filename)) {
        return res.status(400).json({ ok: false, message: "Invalid filename" });
      }
      if (typeof data === "undefined") {
        return res.status(400).json({ ok: false, message: "Missing data" });
      }

      const dir = TRANSLATION_FILES.has(filename) ? TRANSLATIONS_DIR : CONTENT_DIR;
      const resolved = path.resolve(dir, filename);

      if (!isPathSafe(dir, filename, resolved)) {
        return res.status(400).json({ ok: false, message: "Unsafe path" });
      }

      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(resolved, JSON.stringify(data, null, 2) + "\n", "utf8");

      res.json({ ok: true, path: resolved });
    } catch (error) {
      console.error("[local-cms] content write failed:", error);
      res.status(500).json({ ok: false, message: "Failed to write content" });
    }
  });

  // POST /__local/asset — decode a data URL and write it under client/public[/media]
  app.post("/__local/asset", async (req: Request, res: Response) => {
    if (rejectIfRemote(req, res)) return;
    try {
      const { filename, dataUrl, dir } = req.body ?? {};

      if (typeof filename !== "string" || !ASSET_FILENAME.test(filename)) {
        return res.status(400).json({ ok: false, message: "Invalid filename" });
      }
      if (typeof dataUrl !== "string") {
        return res.status(400).json({ ok: false, message: "Missing dataUrl" });
      }
      const subdir = typeof dir === "string" ? dir : "";
      if (subdir !== "" && subdir !== "media") {
        return res.status(400).json({ ok: false, message: "Invalid dir" });
      }

      const match = /^data:[^;,]+;base64,(.+)$/s.exec(dataUrl);
      if (!match) {
        return res.status(400).json({ ok: false, message: "Invalid data URL" });
      }

      const buffer = Buffer.from(match[1], "base64");
      if (buffer.byteLength > MAX_ASSET_BYTES) {
        return res.status(413).json({ ok: false, message: "Asset exceeds 25MB limit" });
      }

      const targetDir = subdir === "media" ? MEDIA_DIR : PUBLIC_DIR;
      const resolved = path.resolve(targetDir, filename);

      if (!isPathSafe(targetDir, filename, resolved)) {
        return res.status(400).json({ ok: false, message: "Unsafe path" });
      }

      await fs.mkdir(targetDir, { recursive: true });
      await fs.writeFile(resolved, buffer);

      const url = subdir === "media" ? `/media/${filename}` : `/${filename}`;
      res.json({ ok: true, path: resolved, url });
    } catch (error) {
      console.error("[local-cms] asset write failed:", error);
      res.status(500).json({ ok: false, message: "Failed to write asset" });
    }
  });

  // POST /__local/publish — stage tracked dirs, commit, push
  app.post("/__local/publish", async (req: Request, res: Response) => {
    if (rejectIfRemote(req, res)) return;
    try {
      const git = (args: string[]) =>
        execFileAsync("git", args, { cwd: REPO_ROOT });

      await git(["add", "-A", "--", ...TRACKED_PATHS]);

      // `git diff --cached --quiet` exits non-zero (throws) when there are staged changes.
      let hasStaged = false;
      try {
        await git(["diff", "--cached", "--quiet"]);
      } catch {
        hasStaged = true;
      }

      if (!hasStaged) {
        return res.json({ ok: true, nothingToPublish: true });
      }

      const message = `content: update via local CMS ${new Date().toISOString()}`;
      await git(["commit", "-m", message]);

      const { stdout: hashOut } = await git(["rev-parse", "--short", "HEAD"]);
      const { stdout: branchOut } = await git(["rev-parse", "--abbrev-ref", "HEAD"]);
      const hash = hashOut.trim();
      const branch = branchOut.trim();

      await git(["push", "origin", branch]);

      res.json({ ok: true, hash, branch, message });
    } catch (error: any) {
      console.error("[local-cms] publish failed:", error);
      res.status(500).json({ ok: false, message: error?.message || "Publish failed" });
    }
  });

  // GET /__local/git-status — porcelain status of the tracked dirs
  app.get("/__local/git-status", async (req: Request, res: Response) => {
    if (rejectIfRemote(req, res)) return;
    try {
      const { stdout } = await execFileAsync(
        "git",
        ["status", "--porcelain", "--", ...TRACKED_PATHS],
        { cwd: REPO_ROOT },
      );
      const files = stdout
        .split("\n")
        .map((line) => line.trimEnd())
        .filter((line) => line.length > 0)
        .map((line) => ({
          status: line.slice(0, 2).trim(),
          file: line.slice(3),
        }));
      res.json({ ok: true, pending: files.length > 0, files });
    } catch (error: any) {
      console.error("[local-cms] git-status failed:", error);
      res.status(500).json({ ok: false, message: error?.message || "git status failed" });
    }
  });

  // GET /__local/git-log?skip&limit — paginated commit log
  app.get("/__local/git-log", async (req: Request, res: Response) => {
    if (rejectIfRemote(req, res)) return;
    try {
      const skip = Math.max(0, parseInt(String(req.query.skip ?? "0"), 10) || 0);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20),
      );

      const UNIT = "\x1f"; // field separator
      const RECORD = "\x1e"; // record separator
      const format = ["%H", "%s", "%an", "%cI"].join(UNIT) + RECORD;

      const { stdout: branchOut } = await execFileAsync(
        "git",
        ["rev-parse", "--abbrev-ref", "HEAD"],
        { cwd: REPO_ROOT },
      );
      const branch = branchOut.trim();

      const { stdout: countOut } = await execFileAsync(
        "git",
        ["rev-list", "--count", "HEAD"],
        { cwd: REPO_ROOT },
      );
      const total = parseInt(countOut.trim(), 10) || 0;

      const { stdout: logOut } = await execFileAsync(
        "git",
        [
          "log",
          `--skip=${skip}`,
          `--max-count=${limit}`,
          `--pretty=format:${format}`,
        ],
        { cwd: REPO_ROOT },
      );

      const commits = logOut
        .split(RECORD)
        .map((rec) => rec.replace(/^\n/, ""))
        .filter((rec) => rec.trim().length > 0)
        .map((rec) => {
          const [hash, subject, author, date] = rec.split(UNIT);
          return { hash, subject, author, date };
        });

      res.json({ ok: true, branch, total, skip, limit, commits });
    } catch (error: any) {
      console.error("[local-cms] git-log failed:", error);
      res.status(500).json({ ok: false, message: error?.message || "git log failed" });
    }
  });
}
