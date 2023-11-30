const Erros = require('../errors/Erros')
const { sequelize } = require('../models')
const { RessuprimentoServices } = require('../services')
const ressuprimentoServices = new RessuprimentoServices()

class RessuprimentoController {
    
    static async criaPedidoRessuprimento(req, res) {
        let trans = await sequelize.transaction()
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erros(415, 'O content-type da requisição deve ser application/json')
            }

            const { produtos, fornecedorId, depositoId } = req.body

            const novoPedido = await ressuprimentoServices.criaNovoPedidoRessuprimento(fornecedorId, depositoId, produtos, trans)

            await trans.commit()
            return res.status(201).json({
                message: 'Pedido de Ressuprimento criado!',
                info: novoPedido
            })
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }
}

module.exports = RessuprimentoController