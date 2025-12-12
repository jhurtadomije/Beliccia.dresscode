import EmailService from "../services/EmailService.js";
import CitasRepository from "../repositories/CitasRepository.js";


const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

const toMysqlDateTime = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return s.replace("T", " ") + ":00";
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) return s + ":00";
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) return s;
  return null;
};

export default class CitasController {
  // POST /api/citas (público o auth opcional si tú quieres)
  static async crear(req, res) {
    try {
      const {
        nombre,
        email,
        telefono = null,
        tipo = "info",
        mensaje = null,
        producto_id = null,
        categoria_id = null,
        fecha_solicitada = null,
      } = req.body || {};

      const nombreClean = String(nombre || "").trim();
      const emailClean = String(email || "").trim();

      if (!nombreClean) return res.status(400).json({ error: "El nombre es obligatorio." });
      if (!emailClean || !isValidEmail(emailClean)) {
        return res.status(400).json({ error: "El email no es válido." });
      }
      if (!["cita", "info"].includes(tipo)) {
        return res.status(400).json({ error: "El tipo debe ser 'cita' o 'info'." });
      }

      const fecha = toMysqlDateTime(fecha_solicitada);

      // si viene auth (por si algún día proteges el post), asigna usuario_id
      const usuario_id = req.user?.id ? Number(req.user.id) : null;

      const cita = await CitasRepository.crear({
        usuario_id,
        nombre: nombreClean,
        email: emailClean,
        telefono: telefono ? String(telefono).trim() : null,
        tipo,
        mensaje: mensaje ? String(mensaje).trim() : null,
        producto_id: producto_id ? Number(producto_id) : null,
        categoria_id: categoria_id ? Number(categoria_id) : null,
        fecha_solicitada: fecha,
      });

      // ✅ Emails (no bloquean la respuesta si fallan)
      (async () => {
        try {
          await EmailService.citaSolicitadaCliente({
            email: cita.email,
            nombre: cita.nombre,
            cita,
          });

          await EmailService.citaSolicitadaInternal({ cita });
        } catch (e) {
          console.error("⚠️ Error enviando emails de cita (crear):", e?.message || e);
        }
      })();

      return res.status(201).json({ ok: true, data: cita, message: "Solicitud registrada correctamente." });
    } catch (err) {
      console.error("CitasController.crear:", err);
      return res.status(500).json({ error: "Error creando la solicitud." });
    }
  }

  // GET /api/citas (cliente: suyas / admin: todas)
  static async listar(req, res) {
    try {
      const user = req.user; // requireAuth
      const { estado = null, tipo = null } = req.query || {};

      if (user?.rol === "admin") {
        const rows = await CitasRepository.listarTodas({ estado, tipo });
        return res.json({ ok: true, data: rows });
      }

      const rows = await CitasRepository.listarParaUsuario({
        usuarioId: Number(user.id),
        email: user.email,
      });

      return res.json({ ok: true, data: rows });
    } catch (err) {
      console.error("CitasController.listar:", err);
      return res.status(500).json({ error: "Error listando citas." });
    }
  }

  // GET /api/citas/:id (cliente: propia / admin: cualquiera)
  static async detalle(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido." });

      const user = req.user;

      if (user?.rol === "admin") {
        const cita = await CitasRepository.obtenerPorId(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });
        return res.json({ ok: true, data: cita });
      }

      const cita = await CitasRepository.obtenerPorIdYUsuarioOEmail(
        id,
        Number(user.id),
        user.email
      );

      if (!cita) return res.status(404).json({ error: "Cita no encontrada." });
      return res.json({ ok: true, data: cita });
    } catch (err) {
      console.error("CitasController.detalle:", err);
      return res.status(500).json({ error: "Error obteniendo detalle de cita." });
    }
  }

  // PUT /api/citas/:id (admin)
    static async actualizar(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido." });

      // 👇 Necesario para saber si hubo cambio real
      const before = await CitasRepository.obtenerPorId(id);
      if (!before) return res.status(404).json({ error: "Cita no encontrada." });

      const { estado, fecha_solicitada, fecha_confirmada, nota_interna } = req.body || {};

      const patch = {};
      if (estado !== undefined) patch.estado = estado;
      if (fecha_solicitada !== undefined) patch.fecha_solicitada = toMysqlDateTime(fecha_solicitada);
      if (fecha_confirmada !== undefined) patch.fecha_confirmada = toMysqlDateTime(fecha_confirmada);
      if (nota_interna !== undefined) patch.nota_interna = nota_interna ? String(nota_interna) : null;

      const updated = await CitasRepository.actualizar(id, patch);
      if (!updated) return res.status(404).json({ error: "Cita no encontrada." });

      // ✅ Emails condicionales (no bloquean)
      (async () => {
        try {
          const estadoAntes = before.estado;
          const estadoDespues = updated.estado;

          const antesFecha = before.fecha_confirmada ? String(before.fecha_confirmada) : null;
          const despuesFecha = updated.fecha_confirmada ? String(updated.fecha_confirmada) : null;

          // 1) Si pasa a confirmada y tiene fecha_confirmada => email cliente
          const pasaAConfirmada =
            estadoAntes !== "confirmada" && estadoDespues === "confirmada" && !!updated.fecha_confirmada;

          // 2) Si ya estaba confirmada pero cambiaste la fecha_confirmada => también avisar
          const cambioFechaConfirmada =
            estadoDespues === "confirmada" && antesFecha !== despuesFecha && !!updated.fecha_confirmada;

          if (pasaAConfirmada || cambioFechaConfirmada) {
            await EmailService.citaConfirmadaCliente({
              email: updated.email,
              nombre: updated.nombre,
              cita: updated,
            });
          }

          // (opcional) aviso interno si cambia a rechazada/completada etc.
          // si lo quieres, te lo preparo también
        } catch (e) {
          console.error("⚠️ Error enviando emails de cita (actualizar):", e?.message || e);
        }
      })();

      return res.json({ ok: true, data: updated, message: "Cita actualizada." });
    } catch (err) {
      console.error("CitasController.actualizar:", err);
      if (String(err?.message || "").toLowerCase().includes("estado inválido")) {
        return res.status(400).json({ error: "Estado inválido." });
      }
      return res.status(500).json({ error: "Error actualizando cita." });
    }
  }


  // DELETE /api/citas/:id (admin)
  static async borrar(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido." });

      const ok = await CitasRepository.borrar(id);
      if (!ok) return res.status(404).json({ error: "Cita no encontrada." });

      return res.json({ ok: true, message: "Cita eliminada." });
    } catch (err) {
      console.error("CitasController.borrar:", err);
      return res.status(500).json({ error: "Error eliminando cita." });
    }
  }
}
