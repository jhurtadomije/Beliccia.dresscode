// src/pages/admin/AdminProductoEditar.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { resolveImageUrl, PLACEHOLDER } from "../../services/imageUrl";

const initialState = {
  id: null,
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
  carpeta_imagenes: "", // solo para decidir donde guardar nuevas imágenes
};

export default function AdminProductoEditar() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [colecciones, setColecciones] = useState([]);

  const [form, setForm] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null); // portada actual
  const [imagenes, setImagenes] = useState([]); // nuevas imágenes (File[])

  const [loadingCombos, setLoadingCombos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga de combos + producto
  useEffect(() => {
    let alive = true;

    async function cargar() {
      try {
        setLoadingCombos(true);
        setError("");

        const [catRes, marRes, colRes, prodRes] = await Promise.all([
          api.get("/categorias"),
          api.get("/marcas"),
          api.get("/colecciones"),
          api.get(`/productos/${encodeURIComponent(slug)}`),
        ]);

        if (!alive) return;

        setCategorias(catRes.data || []);
        setMarcas(marRes.data || []);
        setColecciones(colRes.data || []);

        const p = prodRes.data;
        const catId =
          (catRes.data || []).find((c) => c.nombre === p.categoria)?.id ?? "";
        const marcaId =
          (marRes.data || []).find((m) => m.nombre === p.marca)?.id ?? "";
        const colId =
          (colRes.data || []).find((c) => c.nombre === p.coleccion)?.id ?? "";

        setForm((prev) => ({
          ...prev,
          id: p.id,
          nombre: p.nombre || "",
          slug: p.slug || "",
          codigo_interno: p.codigo_interno || "",
          categoria_id: String(catId || ""),
          marca_id: String(marcaId || ""),
          coleccion_id: String(colId || ""),
          descripcion_corta: p.descripcion_corta || "",
          descripcion_larga: p.descripcion_larga || "",
          precio_base:
            p.precio_base === null || p.precio_base === undefined
              ? ""
              : p.precio_base,
          venta_online: !!p.venta_online,
          visible_web: p.visible_web !== 0,
          tags_origen: p.tags_origen || "",
          carpeta_imagenes: "", // el admin puede rellenarla si quiere
        }));

        // Imagen de portada actual
        const imagenes = p.imagenes || [];
        const portada = imagenes.find((img) => img.es_portada) || imagenes[0];

        if (portada && portada.url) {
          setPreviewImage(resolveImageUrl(portada.url));
        } else if (p.imagen_portada) {
          setPreviewImage(resolveImageUrl(p.imagen_portada));
        } else {
          setPreviewImage(null);
        }
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setError("No se pudo cargar el producto para editar.");
      } finally {
        if (alive) setLoadingCombos(false);
      }
    }

    cargar();
    return () => {
      alive = false;
    };
  }, [slug]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

      // Igual que en "nuevo": usamos FormData para mezclar texto + imágenes
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

      // Nuevas imágenes (opcionales)
      imagenes.forEach((file) => {
        fd.append("imagenes", file);
      });

      await api.put(`/productos/${form.id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Producto actualizado correctamente.");
      navigate("/admin/productos");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al actualizar el producto.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingCombos) {
    return (
      <section className="py-4">
        <div className="container">
          <p>Cargando producto…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Editar producto</h2>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/productos")}
          >
            Volver al listado
          </button>
        </div>

        {previewImage && (
          <div className="mb-4 d-flex align-items-center gap-3">
            <div>
              <div className="text-muted small">Imagen de portada actual</div>
              <img
                src={previewImage}
                alt={form.nombre || "Producto"}
                style={{
                  width: 90,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger py-2">{error}</div>}

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
                El slug identifica el producto en la URL
                (&quot;/producto/&lt;slug&gt;&quot;). Procura no cambiarlo si ya
                está en producción.
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
                value={form.categoria_id ?? ""}
                onChange={handleChange}
              >
                <option value="">-- Sin categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
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
                value={form.marca_id ?? ""}
                onChange={handleChange}
              >
                <option value="">-- Sin marca --</option>
                {marcas.map((m) => (
                  <option key={m.id} value={String(m.id)}>
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
                value={form.coleccion_id ?? ""}
                onChange={handleChange}
              >
                <option value="">-- Sin colección --</option>
                {colecciones.map((c) => (
                  <option key={c.id} value={String(c.id)}>
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

            {/* Tags origen */}
            <div className="col-12">
              <label className="form-label">
                Tag de origen (ej: &quot;corte-recto&quot;, &quot;bolsos&quot;,
                &quot;tocados&quot;, &quot;madrinas&quot;,
                &quot;invitadas&quot;)
              </label>
              <input
                type="text"
                name="tags_origen"
                className="form-control"
                value={form.tags_origen}
                onChange={handleChange}
              />
              <small className="text-muted">
                Se utiliza para filtros internos (cortes, tipos de complemento,
                etc.).
              </small>
            </div>

            {/* Carpeta de imágenes + input archivos */}
            <div className="col-md-6">
              <label className="form-label">Carpeta de imágenes</label>
              <input
                type="text"
                name="carpeta_imagenes"
                className="form-control"
                placeholder="ej: complementos/2025/marca-x"
                value={form.carpeta_imagenes}
                onChange={handleChange}
              />
              <small className="text-muted">
                Si subes nuevas imágenes, se guardarán dentro de esa carpeta en{" "}
                <code>/uploads</code>. Si la dejas vacía, se usarán directamente{" "}
                <code>/uploads</code>.
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Añadir nuevas imágenes</label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
              />
              <small className="text-muted">
                Opcional. Si ya hay imágenes y subes nuevas, se añadirán al
                producto (la portada actual se mantiene).
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
              {loading ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
