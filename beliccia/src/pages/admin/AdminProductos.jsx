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

        const [prodRes, catRes, marRes, colRes] = await Promise.all([
          api.get("/productos", { params: { page: 1, limit: 200 } }),
          api.get("/categorias"),
          api.get("/marcas"),
          api.get("/colecciones"),
        ]);

        if (!alive) return;

        const payload = prodRes.data;
        const arr = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
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

  // --- BORRAR PRODUCTO ---
  const handleDelete = async (producto) => {
  const ok = window.confirm(
    `¿Seguro que quieres borrar el producto "${producto.nombre}"? ` +
    `Se eliminarán también sus imágenes.`
  );
  if (!ok) return;

  try {
    await api.delete(`/productos/${producto.id}`);
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
  } catch (err) {
    console.error(err);
    alert('No se pudo borrar el producto. Revisa la consola.');
  }
};


  // --- Filtrado de productos y búsqueda ---
const filtrados = productos.filter((p) => {
  const q = busqueda.trim().toLowerCase();
  if (!q) return true;

  const nombre = String(p.nombre || "").toLowerCase();
  const codigo = String(p.codigo_interno || "").toLowerCase();
  const slug = String(p.slug || "").toLowerCase();

  //IMPORTANTE: usar el mismo “fallback” que usas al pintar la tabla
  const categoriaNombre = String(
    p.categoria || categoriasMap[p.categoria_id] || ""
  ).toLowerCase();

  const marcaNombre = String(
    p.marca || marcasMap[p.marca_id] || ""
  ).toLowerCase();

  const coleccionNombre = String(
    p.coleccion || coleccionesMap[p.coleccion_id] || ""
  ).toLowerCase();

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
          <Link to="/admin" className="btn btn-outline-dark">
            Volver al dashboard
          </Link>

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
                  <th style={{ width: 90 }}>Imagen</th>
                  <th>Nombre</th>
                  <th>Código interno</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Colección</th>
                  <th>Precio base</th>
                  <th>Online</th>
                  <th>Visible</th>
                  <th style={{ width: 130 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => {
                  const imgRaw =
                    p.imagen_portada ||
                    (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                    p.imagen ||
                    "";
                  const imgUrl = resolveImageUrl(imgRaw) || PLACEHOLDER;

                  const categoriaNombre =
                    p.categoria || categoriasMap[p.categoria_id] || "-";
                  const marcaNombre = p.marca || marcasMap[p.marca_id] || "-";
                  const coleccionNombre =
                    p.coleccion || coleccionesMap[p.coleccion_id] || "-";

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
                      <td className="fw-semibold">{p.nombre}</td>
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
                            to={`/admin/productos/${p.slug}`}
                            className="btn btn-outline-dark"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(p)}
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
