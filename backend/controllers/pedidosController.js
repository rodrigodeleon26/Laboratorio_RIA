const { pedidos } = require('../mockData');

exports.getPedidos = (req, res) => {
  res.json(pedidos);
};

exports.createPedido = function(pedido) {
    const newPedido = pedido;
    newPedido.id = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;
    pedidos.push(newPedido);
};

exports.getPedidoById = function (pedidoId) {
    const pedido = pedidos.find(p => p.id == pedidoId);
    if (pedido) {
        return pedido;
    } else {
        return null;
    }
};

exports.updatePedido = function (pedido) {
    const pedidoIndex = pedidos.findIndex(p => p.id == pedido.id);
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex] = { ...pedidos[pedidoIndex], ...pedido };
        return pedidos[pedidoIndex];
    }
    return null;
};

exports.deletePedido = function (pedidoId) {
    const pedidoIndex = pedidos.findIndex(p => p.id == id);
    if (pedidoIndex !== -1) {
        pedidos.splice(pedidoIndex, 1);
    } else {
        return null;
    }
};