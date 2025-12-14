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

export default function Buscar() {
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("cat") || "all");
  const qDebounced = useDebounced(q, 200);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1) Cargar catálogo completo
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/productos");
        // ✅ TU API: { data: [...], meta: {...} }
        const arr = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) setItems(arr);
      } catch (e) {
        if (!cancelled) setError("No se pudo cargar el catálogo para buscar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Mantener URL sincronizada (sin fastidiar el input)
  useEffect(() => {
    const next = new URLSearchParams();
    if (qDebounced) next.set("q", qDebounced);
    if (cat !== "all") next.set("cat", cat);
    setParams(next, { replace: true });
  }, [qDebounced, cat, setParams]);

  // 3) Filtrar
  const results = useMemo(() => {
    const term = norm(qDebounced);

    return items.filter((p) => {
      if (Number(p?.visible_web) !== 1) return false;

      if (cat !== "all") {
        const c = norm(p?.categoria);
        if (!c.includes(norm(cat))) return false;
      }

      if (!term) return true;

      const hay = [
        p?.nombre,
        p?.slug,
        p?.descripcion_corta,
        p?.tags_origen,
        p?.categoria,
        p?.marca,
        p?.coleccion,
        p?.codigo_interno,
      ]
        .filter(Boolean)
        .map(norm)
        .join(" ");

      return hay.includes(term);
    });
  }, [items, qDebounced, cat]);

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 className="mb-4 text-center">Buscar</h1>

        {/* DEBUG útil (puedes borrarlo luego) */}
        <div className="text-muted small mb-2">
          Catálogo: <b>{items.length}</b> · Resultados: <b>{results.length}</b>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, marca, corte, tags…"
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
              <option value="all">Todas</option>
              {/* tus categorías reales */}
              <option value="Novias">Novias</option>
              <option value="Fiesta">Fiesta</option>
              <option value="Complementos">Complementos</option>
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
                  const img = resolveImageUrl?.(p?.imagen_portada) || PLACEHOLDER;
                  const key = p?.slug ?? p?.id;

                  return (
                    <div className="col-12 col-sm-6 col-lg-4" key={key}>
                      <Link to={`/producto/${p?.slug ?? p?.id}`} className="text-decoration-none">
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
