// src/pages/admin/AdminProductoNuevo.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const initialState = {
  nombre: "",
  slug: "",
  codigo_interno: "",
  categoria_id: "",
  marca_id: "",
  coleccion_id: "",
  descripcion_corta: "",
  descripcion_larga: "",
  precio_base: "",
  venta_online: false,
  visible_web: true,
  tags_origen: "",
  carpeta_imagenes: "",
  tallas: [],
};
const TALLAS = [
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "54",
  "56",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Unica"
];

export default function ProductoNuevo() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [colecciones, setColecciones] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialState);
  const [imagenes, setImagenes] = useState([]); // 👈 File[]

  // Cargar combos
  useEffect(() => {
    let alive = true;

    async function loadCombos() {
      try {
        setLoadingCombos(true);

        const [catRes, marRes, colRes] = await Promise.all([
          api.get("/categorias"),
          api.get("/marcas"),
          api.get("/colecciones"),
        ]);

        if (!alive) return;
        setCategorias(catRes.data || []);
        setMarcas(marRes.data || []);
        setColecciones(colRes.data || []);
      } catch (err) {
        console.error(err);
        if (alive)
          setError("No se pudieron cargar categorías/marcas/colecciones.");
      } finally {
        if (alive) setLoadingCombos(false);
      }
    }

    loadCombos();
    return () => {
      alive = false;
    };
  }, []);

  function slugify(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Generar slug si está vacío
      if (name === "nombre" && !prev.slug) {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setImagenes(files);
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  if (!form.nombre.trim()) {
    setError("El nombre del producto es obligatorio.");
    return;
  }
  if (!form.slug.trim()) {
    setError("El slug es obligatorio.");
    return;
  }

  try {
    setLoading(true);

    const fd = new FormData();
    fd.append("nombre", form.nombre.trim());
    fd.append("slug", form.slug.trim());
    fd.append("codigo_interno", form.codigo_interno || "");
    fd.append("categoria_id", form.categoria_id || "");
    fd.append("marca_id", form.marca_id || "");
    fd.append("coleccion_id", form.coleccion_id || "");
    fd.append("descripcion_corta", form.descripcion_corta || "");
    fd.append("descripcion_larga", form.descripcion_larga || "");
    fd.append("precio_base", form.precio_base || "");
    fd.append("venta_online", form.venta_online ? "1" : "0");
    fd.append("visible_web", form.visible_web ? "1" : "0");
    fd.append("tags_origen", form.tags_origen || "");
    fd.append("carpeta_imagenes", form.carpeta_imagenes || "");

    const variantes = (form.tallas || []).map((talla) => ({
      talla,
      stock: 0,
      color: "",
    }));
    fd.append("variantes", JSON.stringify(variantes));

    imagenes.forEach((file) => {
      fd.append("imagenes", file); 
    });

    await api.post("/productos", fd, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // multipart para que NO lo trate como JSON
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Producto creado correctamente.");
    navigate("/admin/productos");
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message ||
        "Error al crear el producto. Revisa los datos."
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <h2 className="mb-4">Nuevo producto</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {loadingCombos ? (
          <p>Cargando datos necesarios…</p>
        ) : (
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <div className="row g-3">
              {/* Nombre / slug / código */}
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  name="slug"
                  className="form-control"
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Se genera automáticamente a partir del nombre (puedes
                  editarlo).
                </small>
              </div>

              <div className="col-md-4">
                <label className="form-label">Código interno / SKU</label>
                <input
                  type="text"
                  name="codigo_interno"
                  className="form-control"
                  value={form.codigo_interno}
                  onChange={handleChange}
                />
              </div>

              {/* Categoría / Marca / Colección */}
              <div className="col-md-4">
                <label className="form-label">Categoría</label>
                <select
                  name="categoria_id"
                  className="form-select"
                  value={form.categoria_id}
                  onChange={handleChange}
                >
                  <option value="">-- Sin categoría --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Marca</label>
                <select
                  name="marca_id"
                  className="form-select"
                  value={form.marca_id}
                  onChange={handleChange}
                >
                  <option value="">-- Sin marca --</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Colección</label>
                <select
                  name="coleccion_id"
                  className="form-select"
                  value={form.coleccion_id}
                  onChange={handleChange}
                >
                  <option value="">-- Sin colección --</option>
                  {colecciones.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                      {c.activa === 0 ? " (no activa)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio y flags */}
              <div className="col-md-4">
                <label className="form-label">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="precio_base"
                  className="form-control"
                  value={form.precio_base}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    id="venta_online"
                    name="venta_online"
                    className="form-check-input"
                    checked={form.venta_online}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="venta_online">
                    Disponible para venta online
                  </label>
                </div>
              </div>

              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    id="visible_web"
                    name="visible_web"
                    className="form-check-input"
                    checked={form.visible_web}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="visible_web">
                    Visible en la web
                  </label>
                </div>
              </div>

              {/* Descripciones */}
              <div className="col-12">
                <label className="form-label">Descripción corta</label>
                <input
                  type="text"
                  name="descripcion_corta"
                  className="form-control"
                  value={form.descripcion_corta}
                  onChange={handleChange}
                  maxLength={255}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción larga</label>
                <textarea
                  name="descripcion_larga"
                  className="form-control"
                  rows={4}
                  value={form.descripcion_larga}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Introduce un Tag (ej: 'corte-recto', bolsos, pendientes, madrinas, invitadas)</label>
                <input
                  type="text"
                  name="tags_origen"
                  className="form-control"
                  value={form.tags_origen}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-3">
                <label className="form-label">Tallas disponibles</label>
                <div className="d-flex flex-wrap gap-2">
                  {TALLAS.map((t) => (
                    <div key={t} className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        id={`talla-${t}`}
                        className="form-check-input"
                        checked={form.tallas?.includes(t) || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setForm((prev) => {
                            const current = prev.tallas || [];
                            if (checked) {
                              return { ...prev, tallas: [...current, t] };
                            } else {
                              return {
                                ...prev,
                                tallas: current.filter((x) => x !== t),
                              };
                            }
                          });
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`talla-${t}`}
                      >
                        {t}
                      </label>
                    </div>
                  ))}
                </div>
                <small className="text-muted">
                  Estas tallas generarán variantes con stock inicial (por
                  ejemplo 0).
                </small>
              </div>

              {/* Carpeta de imágenes */}
              <div className="col-md-6">
                <label className="form-label">Carpeta de imágenes</label>
                <input
                  type="text"
                  name="carpeta_imagenes"
                  className="form-control"
                  placeholder="ej: novias/2026/marca-x"
                  value={form.carpeta_imagenes}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Se creará automáticamente dentro de <code>/uploads</code> si
                  no existe.
                </small>
              </div>

              {/* Input de imágenes */}
              <div className="col-md-6">
                <label className="form-label">Imágenes del producto</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                />
                <small className="text-muted">
                  Puedes seleccionar una o varias imágenes. La primera será la
                  portada.
                </small>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/productos")}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? "Guardando…" : "Guardar producto"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
