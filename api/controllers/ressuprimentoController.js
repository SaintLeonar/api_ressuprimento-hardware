const { RessuprimentoServices } = require('../services')
const ressuprimentoServices = new RessuprimentoServices()

class RessuprimentoController {
    
    static async criaPedidoRessuprimento(req, res) {
        try {
            const { produtos, fornecedorId, depositoId } = req.body

            const novoPedido = await ressuprimentoServices.criaNovoPedidoRessuprimento(fornecedorId, depositoId, produtos)

            return res.status(201).json({
                message: 'Pedido de Ressuprimento criado!',
                info: novoPedido
            })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}

module.exports = RessuprimentoController