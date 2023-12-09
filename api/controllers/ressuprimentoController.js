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
     *  Implementação do Caso de Uso UC08 - Ressuprimento de Produto (Internacional e Nacional)
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
     *  Implementação do Caso de Uso UC09 - Aceitação de Pedido de Ressuprimento (Internacional e Nacional)
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
     *  Implementação do Caso de Uso UC10   - Pagamento do Ressuprimento (Internacional e Nacional)
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

    /**
     * 
     *  Implementação do Caso de Uso UC13 - Despacho do Pedido de Ressuprimento (Nacional)
     * 
     */
        static async despachoNacional(req, res) {
            let trans = await sequelize.transaction()
            const { id } = req.params
            try {
                const contentType = req.headers['content-type']
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Erro(415, 'O content-type da requisição deve ser application/json')
                }
    
                const { data_despacho, transportadora_local_id, frete_local, previsao_chegada } = req.body
    
                // Chamada Serviço Despacho Nacional
                const pedidoAtualizado = await ressuprimentoServices.despachaPedidoNacional(id, data_despacho, transportadora_local_id, frete_local, previsao_chegada)
    
                const mensagem = `Pedido ${id} despachado para para transportadora local`
    
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

    /**
     * 
     *  Implementação do Caso de Uso UC14 - Chegada do Pedido de Ressuprimento na alfândega (Internacional e Nacional)
     * 
     */
    static async chegadaAlfandega(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const pedido = await ressuprimentoServices.buscaUmRegistro(id)
            if(!pedido) {
                throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
            }

            if(pedido.status_pedido_ressuprimento === 'Despachado para alfândega internacional') {
                const { chegada_alfandega_internacional } = req.body
                const pedido_atualizado = await ressuprimentoServices.chegadaAlfandega(pedido, chegada_alfandega_internacional, 'internacional', trans)
            } else if (pedido.status_pedido_ressuprimento === 'Liberado pela alfândega internacional') {
                const { chegada_alfandega_nacional } = req.body
                const pedido_atualizado = await ressuprimentoServices.chegadaAlfandega(pedido, chegada_alfandega_nacional, 'nacional', trans)
            } else {
                throw new Erro(400, 'status_pedido_ressuprimento com problema de escrita')
            }

            await trans.commit()
            return res.status(204).json({})
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC15 - Liberação do Pedido de Ressuprimento na alfândega (Internacional e Nacional)
     * 
     */
    static async liberacaoAlfandega(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const pedido = await ressuprimentoServices.buscaUmRegistro(id)
            if(!pedido) {
                throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
            }

            if(pedido.status_pedido_ressuprimento === 'Chegada em alfândega internacional') {
                const { alfandega_nacional_id, liberacao_alfandega_int } = req.body
                const pedidoAtualizado = await ressuprimentoServices.liberacaoAlfandega(pedido, liberacao_alfandega_int, alfandega_nacional_id, trans)
            } else if (pedido.status_pedido_ressuprimento === 'Liberado pela alfândega internacional') {
                const { liberacao_alfandega_nac } = req.body
                const pedidoAtualizado = await ressuprimentoServices.liberacaoAlfandega(pedido, liberacao_alfandega_nac, null, trans)
            } else {
                throw new Erro(400, 'status_pedido_ressuprimento com problema de escrita')
            }

            await trans.commit()
            return res.status(204).json({})
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC15 - Saída para entrega do Pedido de Ressuprimento (Internacional e Nacional)
     * 
     */
    static async entregaPedido(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const pedido = await ressuprimentoServices.buscaUmRegistro(id)
            if(!pedido) {
                throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
            }

            if(pedido.origem_ressuprimento === 'Internacional') {
                const { saida_nacional, frete_local, transportadora_local_id , previsao_chegada } = req.body
                const pedidoAtualizado = await ressuprimentoServices.entregaPedidoInternacional(pedido, saida_nacional, frete_local, transportadora_local_id, previsao_chegada, trans)
            } else if (pedido.origem_ressuprimento === 'Nacional') {
                const { saida_nacional } = req.body
                const pedidoAtualizado = await ressuprimentoServices.entregaPedidoNacional(pedido, saida_nacional, trans)
            } else {
                throw new Erro(400, 'Origem_Ressuprimento com problema de escrita')
            }

            await trans.commit()
            return res.status(204).json({})
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }

    /**
     * 
     *  Implementação do Caso de Uso UC16 - Recebimento de produtos na loja (Internacional e Nacional)
     * 
     */
    static async recebimentoProdutos(req, res) {
        let trans = await sequelize.transaction()
        const { id } = req.params
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const { data_chegada } = req.body

            // Chamada Serviço Despacho Nacional
            const pedidoAtualizado = await ressuprimentoServices.recebeProdutos(id, data_chegada, trans)

            await trans.commit()
            return res.status(204).json({})
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }
}

module.exports = RessuprimentoController