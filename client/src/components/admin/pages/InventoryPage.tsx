import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Maximize2, Minimize2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useLanguage } from "@/contexts/language-context";
import { downloadJson } from "@/lib/admin-store";
import inventory from "@/content/inventory.json";

interface InventoryNode {
  id: string;
  label: string;
  type: string;
  group: string;
  path: string;
}

interface InventoryEdge {
  from: string;
  to: string;
  kind: string;
}

// Each module group gets a column (left → right: data → logic → UI) and a color
// from the palette, so the graph reads as a dependency flow.
const GROUP_META: Record<string, { col: number; color: string; label: string }> = {
  content: { col: 0, color: "#94A3B8", label: "content" },
  repositories: { col: 1, color: "#F59E0B", label: "repositories" },
  services: { col: 1, color: "#8B5CF6", label: "services" },
  lib: { col: 2, color: "#10B981", label: "lib" },
  hooks: { col: 2, color: "#EC4899", label: "hooks" },
  contexts: { col: 2, color: "#14B8A6", label: "contexts" },
  components: { col: 3, color: "#06B6D4", label: "components" },
  pages: { col: 4, color: "#2563EB", label: "pages" },
};
const FALLBACK = { col: 2, color: "#64748B", label: "other" };

const metaFor = (group: string) => GROUP_META[group] ?? FALLBACK;
const colFor = (group: string) => metaFor(group).col;
const colorFor = (group: string) => metaFor(group).color;

// Distinct groups present, ordered by column then name, used for the toggle chips.
const CHIP_GROUPS = Object.keys(GROUP_META);

const COL_W = 280;
const ROW_H = 30;
const NODE_W = 210;
const NODE_H = 22;
const PAD_X = 40;
const PAD_Y = 30;

const T = {
  es: {
    title: "Inventario",
    search: "Buscar módulo…",
    hint: "Arrastra para mover · rueda para zoom",
    reset: "Reiniciar",
    uses: "Usa",
    usedBy: "Usado por",
    empty: "Haz clic en un módulo para ver sus dependencias y quién lo usa.",
    counts: (n: number, e: number) => `${n} módulos · ${e} relaciones`,
  },
  en: {
    title: "Inventory",
    search: "Search module…",
    hint: "Drag to pan · wheel to zoom",
    reset: "Reset",
    uses: "Uses",
    usedBy: "Used by",
    empty: "Click a module to see its dependencies and who uses it.",
    counts: (n: number, e: number) => `${n} modules · ${e} relations`,
  },
};

export default function InventoryPage() {
  const { language } = useLanguage();
  const tt = T[language];

  const allNodes = inventory.nodes as InventoryNode[];
  const allEdges = inventory.edges as InventoryEdge[];
  const counts = inventory.counts as { nodes: number; edges: number };

  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState({ scale: 0.8, tx: 20, ty: 20 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);

  // Zoom on wheel WITHOUT scrolling the page — a non-passive listener so
  // preventDefault() actually works (React's onWheel is passive).
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setView((v) => ({ ...v, scale: Math.min(3, Math.max(0.25, v.scale * factor)) }));
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, []);

  // Track native fullscreen state for the graph container.
  useEffect(() => {
    const onChange = () => setFs(document.fullscreenElement === graphRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void graphRef.current?.requestFullscreen();
  };

  const visibleNodes = useMemo(
    () => allNodes.filter((n) => !hidden.has(n.group)),
    [allNodes, hidden],
  );

  // Lay out each column as a vertical stack, sorted by label.
  const positions = useMemo(() => {
    const byCol = new Map<number, InventoryNode[]>();
    for (const n of [...visibleNodes].sort((a, b) => a.label.localeCompare(b.label))) {
      const col = colFor(n.group);
      if (!byCol.has(col)) byCol.set(col, []);
      byCol.get(col)!.push(n);
    }
    const pos = new Map<string, { x: number; y: number }>();
    for (const [col, nodes] of byCol) {
      nodes.forEach((n, i) => {
        pos.set(n.id, { x: PAD_X + col * COL_W, y: PAD_Y + i * ROW_H });
      });
    }
    return pos;
  }, [visibleNodes]);

  const visibleIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);
  const edges = useMemo(
    () => allEdges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to)),
    [allEdges, visibleIds],
  );

  // Neighborhood of the selected node, used to highlight and to fill the panel.
  const neighborhood = useMemo(() => {
    if (!selected) return null;
    const uses = edges.filter((e) => e.from === selected).map((e) => e.to);
    const usedBy = edges.filter((e) => e.to === selected).map((e) => e.from);
    const related = new Set<string>([selected, ...uses, ...usedBy]);
    return { uses, usedBy, related };
  }, [selected, edges]);

  const height = useMemo(() => {
    let max = 0;
    const colCounts = new Map<number, number>();
    for (const n of visibleNodes) {
      const col = colFor(n.group);
      colCounts.set(col, (colCounts.get(col) ?? 0) + 1);
    }
    for (const c of colCounts.values()) max = Math.max(max, c);
    return PAD_Y * 2 + max * ROW_H;
  }, [visibleNodes]);
  void height;

  const center = (id: string) => {
    const p = positions.get(id);
    return p ? { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 } : null;
  };

  const toggleGroup = (group: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });

  const queryLc = query.trim().toLowerCase();
  const matchesQuery = (n: InventoryNode) =>
    queryLc.length > 0 && (n.label.toLowerCase().includes(queryLc) || n.id.toLowerCase().includes(queryLc));

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setView((v) => ({
      ...v,
      tx: drag.current!.tx + (e.clientX - drag.current!.x),
      ty: drag.current!.ty + (e.clientY - drag.current!.y),
    }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const selectedNode = selected ? allNodes.find((n) => n.id === selected) ?? null : null;

  return (
    <div data-testid="inventory-page">
      <PageHeader
        title={tt.title}
        actions={
          <button
            onClick={() => downloadJson("inventory.json", inventory)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-input text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            inventory.json
          </button>
        }
      />

      <p className="text-sm text-muted-foreground mb-4">{tt.counts(counts.nodes, counts.edges)}</p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {CHIP_GROUPS.map((group) => {
          const meta = GROUP_META[group];
          const off = hidden.has(group);
          return (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                off ? "bg-muted text-muted-foreground border-transparent" : "bg-card text-foreground border-border"
              }`}
              data-testid={`inventory-filter-${group}`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: off ? "#CBD5E1" : meta.color }} />
              {meta.label}
            </button>
          );
        })}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tt.search}
          className="ml-auto w-56 h-8 rounded-lg border border-border px-3 text-sm focus:outline-none focus:border-primary"
          data-testid="inventory-search"
        />
      </div>

      <div className="flex gap-4">
        <div
          ref={graphRef}
          className={`flex-1 bg-card border border-border overflow-hidden relative ${fs ? "rounded-none" : "rounded-2xl"}`}
          style={{ height: fs ? "100vh" : "70vh" }}
        >
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-input transition-colors"
            title={fs ? (language === "en" ? "Exit fullscreen" : "Salir de pantalla completa") : language === "en" ? "Fullscreen" : "Pantalla completa"}
          >
            {fs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={() => setSelected(null)}
            data-testid="inventory-graph"
          >
            <g transform={`translate(${view.tx},${view.ty}) scale(${view.scale})`}>
              {/* edges */}
              {edges.map((e, i) => {
                const a = center(e.from);
                const b = center(e.to);
                if (!a || !b) return null;
                const active = neighborhood?.related.has(e.from) && neighborhood?.related.has(e.to);
                const touchesSel = selected && (e.from === selected || e.to === selected);
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={touchesSel ? "#2563EB" : "#CBD5E1"}
                    strokeWidth={touchesSel ? 1.5 : 0.6}
                    strokeOpacity={selected && !active ? 0.08 : touchesSel ? 0.9 : 0.35}
                  />
                );
              })}
              {/* nodes */}
              {visibleNodes.map((n) => {
                const p = positions.get(n.id);
                if (!p) return null;
                const color = colorFor(n.group);
                const dim = (selected && !neighborhood?.related.has(n.id)) || (queryLc && !matchesQuery(n));
                const isSel = selected === n.id;
                const hit = queryLc.length > 0 && matchesQuery(n);
                return (
                  <g
                    key={n.id}
                    transform={`translate(${p.x},${p.y})`}
                    style={{ cursor: "pointer", opacity: dim ? 0.18 : 1 }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelected(isSel ? null : n.id);
                    }}
                  >
                    <rect
                      width={NODE_W}
                      height={NODE_H}
                      rx={6}
                      fill={isSel ? color : hit ? "#EFF6FF" : "#FFFFFF"}
                      stroke={isSel || hit ? color : "#E2E8F0"}
                      strokeWidth={isSel || hit ? 2 : 1}
                    />
                    <rect width={4} height={NODE_H} rx={2} fill={color} />
                    <text
                      x={12}
                      y={NODE_H / 2 + 4}
                      fontSize={11}
                      fontWeight={600}
                      fill={isSel ? "#FFFFFF" : "#0F172A"}
                    >
                      {n.label.length > 28 ? n.label.slice(0, 27) + "…" : n.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-muted-foreground bg-card/80 rounded-lg px-2 py-1">
            <span>
              {tt.hint} · {Math.round(view.scale * 100)}%
            </span>
            <button
              onClick={() => setView({ scale: 0.8, tx: 20, ty: 20 })}
              className="text-primary font-semibold hover:underline"
            >
              {tt.reset}
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div
          className="w-72 flex-shrink-0 bg-card rounded-2xl border border-border p-5 overflow-y-auto"
          style={{ height: "70vh" }}
        >
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-[#0f172a]"
                  style={{ backgroundColor: colorFor(selectedNode.group) }}
                >
                  {selectedNode.group}
                </span>
                <h3 className="text-sm font-bold text-foreground mt-2">{selectedNode.label}</h3>
                <code className="text-[11px] text-muted-foreground break-all">{selectedNode.path}</code>
              </div>
              <PanelList
                title={`${tt.uses} (${neighborhood?.uses.length ?? 0})`}
                ids={neighborhood?.uses ?? []}
                nodes={allNodes}
                onPick={setSelected}
              />
              <PanelList
                title={`${tt.usedBy} (${neighborhood?.usedBy.length ?? 0})`}
                ids={neighborhood?.usedBy ?? []}
                nodes={allNodes}
                onPick={setSelected}
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">{tt.empty}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelList({
  title,
  ids,
  nodes,
  onPick,
}: {
  title: string;
  ids: string[];
  nodes: InventoryNode[];
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{title}</p>
      {ids.length === 0 ? (
        <p className="text-xs text-muted-foreground">—</p>
      ) : (
        <div className="space-y-1">
          {ids.map((id) => {
            const n = nodes.find((x) => x.id === id);
            const color = colorFor(n?.group ?? "");
            return (
              <button
                key={id}
                onClick={() => onPick(id)}
                className="flex items-center gap-2 w-full text-left text-xs text-muted-foreground hover:text-primary truncate"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="truncate">{n?.label ?? id}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
