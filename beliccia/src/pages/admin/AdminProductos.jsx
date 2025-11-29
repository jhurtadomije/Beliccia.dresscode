// src/pages/admin/AdminProductos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { resolveImageUrl, PLACEHOLDER } from "../../services/imageUrl";

const money = (n) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n || 0));

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categoriasMap, setCategoriasMap] = useState({});
  const [marcasMap, setMarcasMap] = useState({});
  const [coleccionesMap, setColeccionesMap] = useState({});

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    let alive = true;

    async function cargarDatos() {
      try {
        setCargando(true);
        setError("");

        // Cargamos productos + tablas de referencia en paralelo
        const [prodRes, catRes, marRes, colRes] = await Promise.all([
          api.get("/productos", { params: { limite: 200 } }),
          api.get("/categorias"),
          api.get("/marcas"),
          api.get("/colecciones"),
        ]);

        if (!alive) return;

        const prodData = prodRes.data;
        const arr = Array.isArray(prodData)
          ? prodData
          : Array.isArray(prodData?.resultados)
          ? prodData.resultados
          : Array.isArray(prodData?.items)
          ? prodData.items
          : [];

        setProductos(arr);

        const catMap = {};
        (catRes.data || []).forEach((c) => {
          catMap[c.id] = c.nombre;
        });
        setCategoriasMap(catMap);

        const marMap = {};
        (marRes.data || []).forEach((m) => {
          marMap[m.id] = m.nombre;
        });
        setMarcasMap(marMap);

        const colMap = {};
        (colRes.data || []).forEach((c) => {
          colMap[c.id] = c.nombre;
        });
        setColeccionesMap(colMap);
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setError("No se pudieron cargar los productos.");
      } finally {
        if (alive) {
        setCargando(false);
      }
    }
  }
    cargarDatos();
    return () => {
      alive = false;
    };
  }, []);

  const filtrados = productos.filter((p) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();

    const nombre = (p.nombre || "").toLowerCase();
    const codigo = (p.codigo_interno || "").toLowerCase();
    const slug = (p.slug || "").toLowerCase();

    const categoriaNombre = (categoriasMap[p.categoria_id] || "").toLowerCase();
    const marcaNombre = (marcasMap[p.marca_id] || "").toLowerCase();
    const coleccionNombre = (coleccionesMap[p.coleccion_id] || "").toLowerCase();

    return (
      nombre.includes(q) ||
      codigo.includes(q) ||
      slug.includes(q) ||
      categoriaNombre.includes(q) ||
      marcaNombre.includes(q) ||
      coleccionNombre.includes(q)
    );
  });

  return (
    <section className="py-5" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Catálogo de productos</h2>
            <p className="text-muted mb-0">
              Gestiona los artículos que aparecen en la web de Beliccia.
            </p>
          </div>

          <Link to="/admin/productos/nuevo" className="btn btn-dark">
            + Nuevo producto
          </Link>
        </div>

        {/* Filtros / búsqueda */}
        <div className="card shadow-sm mb-3">
          <div className="card-body d-flex flex-wrap gap-3 align-items-center">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: 320 }}
              placeholder="Buscar por nombre, código, categoría, marca…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="text-muted ms-auto">
              Mostrando {filtrados.length} de {productos.length} productos
            </span>
          </div>
        </div>

        {cargando && (
          <p className="text-center text-muted">Cargando productos…</p>
        )}
        {error && <p className="text-center text-danger">{error}</p>}

        {!cargando && !error && filtrados.length === 0 && (
          <p className="text-center text-muted">
            No hay productos que coincidan con la búsqueda.
          </p>
        )}

        {!cargando && !error && filtrados.length > 0 && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Código interno</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Colección</th>
                  <th>Precio base</th>
                  <th>Online</th>
                  <th>Visible</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => {
                  const imgRaw =
                    (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                    p.imagen ||
                    "";
                  const imgUrl = resolveImageUrl(imgRaw) || PLACEHOLDER;

                  const categoriaNombre = categoriasMap[p.categoria_id] || "-";
                  const marcaNombre = marcasMap[p.marca_id] || "-";
                  const coleccionNombre = coleccionesMap[p.coleccion_id] || "-";

                  return (
                    <tr key={p.id || p.slug || p.codigo_interno}>
                      <td>
                        <img
                          src={imgUrl}
                          alt={p.nombre}
                          style={{
                            width: 60,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold">{p.nombre}</div>
                        <div className="text-muted small text-truncate">
                          {p.descripcion_corta || p.descripcion_larga || ""}
                        </div>
                      </td>
                      <td>{p.codigo_interno || "-"}</td>
                      <td>{categoriaNombre}</td>
                      <td>{marcaNombre}</td>
                      <td>{coleccionNombre}</td>
                      <td>{money(p.precio_base || 0)}</td>
                      <td>
                        {p.venta_online ? (
                          <span className="badge bg-success">Sí</span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </td>
                      <td>
                        {p.visible_web ? (
                          <span className="badge bg-success">Sí</span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/productos/${p.id}`}
                            className="btn btn-outline-dark"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              alert(
                                "Eliminar producto lo montamos en el siguiente paso 😉"
                              )
                            }
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
