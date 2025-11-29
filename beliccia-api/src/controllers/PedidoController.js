// beliccia-api/src/controllers/PedidoController.js
import PedidoService from '../services/PedidoService.js';

const PedidoController = {
  async listar(req, res) {
    try {
      const pedidos = await PedidoService.listar();
      return res.json(pedidos);
    } catch (err) {
      console.error('❌ Error listando pedidos:', err);
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Error al obtener pedidos' });
    }
  },

  async detalle(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoService.detalle(id);
      return res.json(pedido);
    } catch (err) {
      console.error('❌ Error obteniendo pedido:', err);
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Error al obtener el pedido' });
    }
  },

  async crear(req, res) {
    try {
      const pedido = await PedidoService.crear(req.body);
      return res.status(201).json(pedido);
    } catch (err) {
      console.error('❌ Error creando pedido:', err);
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Error al crear el pedido' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoService.actualizar(id, req.body);
      return res.json(pedido);
    } catch (err) {
      console.error('❌ Error actualizando pedido:', err);
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Error al actualizar el pedido' });
    }
  },

  async borrar(req, res) {
    try {
      const { id } = req.params;
      await PedidoService.borrar(id);
      return res.json({ message: 'Pedido eliminado correctamente' });
    } catch (err) {
      console.error('❌ Error borrando pedido:', err);
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Error al borrar el pedido' });
    }
  },
};

export default PedidoController;
