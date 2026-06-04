export const LOCAL_CMS_ENABLED = import.meta.env.DEV;

export async function saveContentFile(filename: string, data: unknown): Promise<boolean> {
  if (!LOCAL_CMS_ENABLED) return false;
  try {
    const res = await fetch("/__local/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function uploadAsset(
  filename: string,
  dataUrl: string,
  dir: "media" = "media",
): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!LOCAL_CMS_ENABLED) return { ok: false };
  try {
    const res = await fetch("/__local/asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, dataUrl, dir }),
    });
    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function publishChanges(): Promise<{
  ok: boolean;
  hash?: string;
  branch?: string;
  nothingToPublish?: boolean;
  error?: string;
}> {
  if (!LOCAL_CMS_ENABLED) return { ok: false };
  try {
    const res = await fetch("/__local/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function fetchGitStatus(): Promise<{
  ok: boolean;
  pending?: boolean;
  files?: string[];
}> {
  if (!LOCAL_CMS_ENABLED) return { ok: false, pending: false };
  try {
    const res = await fetch("/__local/git-status");
    return await res.json();
  } catch {
    return { ok: false, pending: false };
  }
}

export async function fetchGitLog(skip = 0, limit = 10): Promise<unknown> {
  if (!LOCAL_CMS_ENABLED) return { ok: false };
  try {
    const res = await fetch(`/__local/git-log?skip=${skip}&limit=${limit}`);
    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
