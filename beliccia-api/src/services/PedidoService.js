// beliccia-api/src/services/PedidoService.js
import PedidoRepository from '../repositories/PedidoRepository.js';

const PedidoService = {
  async listar() {
    return await PedidoRepository.findAll();
  },

  async detalle(id) {
    const pedido = await PedidoRepository.findById(id);
    if (!pedido) {
      const err = new Error('Pedido no encontrado');
      err.status = 404;
      throw err;
    }
    return pedido;
  },

  async crear(data) {
    if (!data.usuario_id) {
      const err = new Error('El usuario_id es obligatorio');
      err.status = 400;
      throw err;
    }
    return await PedidoRepository.create(data);
  },

  async actualizar(id, data) {
    const existe = await PedidoRepository.findById(id);
    if (!existe) {
      const err = new Error('Pedido no encontrado');
      err.status = 404;
      throw err;
    }
    return await PedidoRepository.update(id, data);
  },

  async borrar(id) {
    const ok = await PedidoRepository.remove(id);
    if (!ok) {
      const err = new Error('Pedido no encontrado');
      err.status = 404;
      throw err;
    }
    return true;
  },
};

export default PedidoService;
