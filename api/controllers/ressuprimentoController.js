const Erro = require('../errors/Erros')
const { sequelize } = require('../models')
const { RessuprimentoServices } = require('../services')
const ressuprimentoServices = new RessuprimentoServices()

class RessuprimentoController {
    
    /**
     *
     *  Implementação da vizualização do estado de um pedido de ressuprimento
     * 
     *  Existe um caso de uso descrito para essa funcionalidade.
     *  Porém, não estou atentando à todos os detalhes.
     *  Criado apenas para fins de teste.
     *  
     */
    static async buscaUmPedidoRessuprimento(req, res) {
        const { id } = req.params
        try {
            const pedido = await ressuprimentoServices.buscaUmRegistro(id)

            if(!pedido){
                throw new Erro(404, 'Pedido de Ressuprimento não encontrado')
            }

            return res.status(200).json(pedido)
        } catch (erro) {
            console.log(`erro: ${erro}`)
            return res.status(500).json(erro)
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC08 - Ressuprimento de Produto
     * 
     */
    static async criaPedidoRessuprimento(req, res) {
        let trans = await sequelize.transaction()
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
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

    /**
     * 
     *  Implementação do Caso de Uso UC09 - Aceitação de Pedido de Ressuprimento
     * 
     *  Possível refatoramento: Verificar de o pedido já foi aceito anteriormente
     * 
     */
    static async aceitaPedidoRessuprimento(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const { aceito } = req.body

            await ressuprimentoServices.aceitaPedidoRessuprimento(id, aceito, trans)

            await trans.commit()
            const mensagem = aceito ? `Pedido ${id} aceito`: `Pedido ${id} recusado`
            return res.status(200).json({
                message: mensagem
            })
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC10 - Pagamento do Ressuprimento
     * 
     *  Possível refatoramento: Verificar se já existe pagamento para esse pedido.
     *                          Verificar se a data do pagamento é anterior à criação do pedido
     * 
     */
    static async realizaPagamento(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const { data_pagamento, tipo_pagamento_ressuprimento } = req.body

            const multaTotal = await ressuprimentoServices.realizaPagamento(id, data_pagamento, tipo_pagamento_ressuprimento)
            
            const mensagem = (multaTotal > 0.0) ? `Pagamento do ressuprimento registrado! Multa total: ${multaTotal}` 
                                                : `Pagamento do ressuprimento registrado!`

            await trans.commit()
            return res.status(201).json({
                message: mensagem
            })
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC12 - Despacho do Pedido de Ressuprimento (Internacional)
     * 
     */
    static async despachoInternacional(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const { data_despacho, alfandega_internacional_id, transportadora_internacional_id,
                    frete_internacional, previsao_chegada } = req.body

            const pedidoAtualizado = await ressuprimentoServices.despachaPedidoInternacional(id, data_despacho, alfandega_internacional_id, 
                                                                                            transportadora_internacional_id, frete_internacional, 
                                                                                            previsao_chegada, trans)

            const mensagem = `Pedido ${id} despachado para alfândega internacional`

            await trans.commit()
            return res.status(200).json({
                message: mensagem
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