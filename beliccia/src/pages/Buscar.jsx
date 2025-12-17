// src/pages/Buscar.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";

const deaccent = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const norm = (s) => deaccent(String(s || "")).toLowerCase().trim();

const useDebounced = (value, ms = 200) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

// Mapea el select a claves “internas” estables
const CAT_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "novias", label: "Novias" },
  { value: "fiesta", label: "Fiesta" }, // madrinas + invitadas
  { value: "complementos", label: "Complementos" },
];

// Categorías equivalentes según tu proyecto
const matchesCategory = (producto, catKey) => {
  if (!catKey || catKey === "all") return true;

  const raw = norm(
    producto?.categoria ||
      producto?.categoria_nombre ||
      producto?.categoria_slug ||
      ""
  );

  // Por si la API devuelve “accesorios” y lo llaman “complementos”
  const isComplementos =
    raw.includes("complement") || raw.includes("accesor") || raw.includes("tocado") || raw.includes("bolso");

  if (catKey === "novias") return raw.includes("novia");
  if (catKey === "complementos") return isComplementos;

  // fiesta = madrinas + invitadas (y/o “fiesta” si existe)
  if (catKey === "fiesta")
    return raw.includes("madrin") || raw.includes("invitad") || raw.includes("fiesta");

  return true;
};

const pickFirstImage = (p) => {
  if (!p) return "";
  if (p.imagen_portada) return p.imagen_portada;
  if (p.imagen) return p.imagen;
  const first = Array.isArray(p.imagenes) ? p.imagenes[0] : null;
  if (typeof first === "string") return first;
  if (first?.url) return first.url;
  return "";
};

export default function Buscar() {
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("cat") || "all");
  const qDebounced = useDebounced(q, 250);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar catálogo completo (paginado)
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      setError("");

      try {
        const limit = 200;
        let page = 1;
        let all = [];

        while (true) {
          const res = await api.get("/productos", { params: { page, limit } });
          const arr = Array.isArray(res.data?.data) ? res.data.data : [];
          all = all.concat(arr);

          // meta con páginas/total. Si no, cortamos cuando venga vacío.
          const totalPages =
            res.data?.meta?.totalPages ??
            res.data?.meta?.total_pages ??
            null;

          if (totalPages) {
            if (page >= totalPages) break;
          } else {
            if (arr.length < limit) break; // última página
          }

          page += 1;

          if (page > 50) break; // seguridad anti-loop
        }

        if (!cancelled) setItems(all);
      } catch (e) {
        if (!cancelled) setError("No se pudo cargar el catálogo para buscar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  //   URL sincronizada
  useEffect(() => {
    const next = new URLSearchParams();
    if (qDebounced) next.set("q", qDebounced);
    if (cat !== "all") next.set("cat", cat);
    setParams(next, { replace: true });
  }, [qDebounced, cat, setParams]);

  //  Filtrar
  const results = useMemo(() => {
    const term = norm(qDebounced);

    // búsqueda por palabras (todas deben aparecer)
    const tokens = term ? term.split(/\s+/).filter(Boolean) : [];

    return items.filter((p) => {
      const visible = p?.visible_web === 1 || p?.visible_web === "1" || p?.visible_web === true;
      if (!visible) return false;

      if (!matchesCategory(p, cat)) return false;

      if (!tokens.length) return true;

      const hay = [
        p?.nombre,
        p?.slug,
        p?.descripcion_corta,
        p?.descripcion_larga,
        p?.tags_origen,
        p?.categoria,
        p?.marca,
        p?.coleccion,
        p?.codigo_interno,
      ]
        .filter(Boolean)
        .map(norm)
        .join(" ");

      return tokens.every((t) => hay.includes(t));
    });
  }, [items, qDebounced, cat]);

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 className="mb-4 text-center">Buscar</h1>

        <div className="text-muted small mb-2">
          Catálogo: <b>{items.length}</b> · Resultados: <b>{results.length}</b>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, marca, tags…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              {CAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center text-muted">Cargando…</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            {!results.length ? (
              <div className="text-center text-muted">
                No hay resultados{qDebounced ? ` para “${qDebounced}”` : ""}.
              </div>
            ) : (
              <div className="row g-3">
                {results.map((p) => {
                  const img = resolveImageUrl(pickFirstImage(p)) || PLACEHOLDER;
                  const key = p?.slug ?? p?.id ?? p?.nombre;

                  return (
                    <div className="col-12 col-sm-6 col-lg-4" key={key}>
                      <Link
                        to={`/producto/${encodeURIComponent(p?.slug ?? p?.id)}`}
                        className="text-decoration-none"
                      >
                        <div className="card h-100 shadow-sm">
                          <img
                            src={img}
                            alt={p?.nombre || "Producto"}
                            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                            style={{ width: "100%", height: 260, objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <div className="fw-semibold text-dark">{p?.nombre}</div>
                            <div className="text-muted small">
                              {p?.marca ? `${p.marca} · ` : ""}
                              {p?.categoria || ""}
                            </div>
                            {p?.descripcion_corta && (
                              <div className="text-muted small mt-1">
                                {p.descripcion_corta}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
