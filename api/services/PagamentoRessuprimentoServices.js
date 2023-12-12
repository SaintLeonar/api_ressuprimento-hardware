const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')
const { addBusinessDays, parse, isValid, isBefore, startOfDay, differenceInDays } = require('date-fns');

class PagamentoRessuprimentoServices extends Services {
    constructor() {
        super('Pagamento_Ressuprimento')
    }

    async criaPagamentoRessuprimento(pPedidoRessuprimentoId, pTransacao) {
        
        // Futuramente obter melhor forma de cadastrar uma multa
        const multa = 1.0
        
        // Futuramente obter melhor forma de cadastrar dias de vencimento
        const hoje = new Date();
        const diasVencimento = 3
        const dataVencimento = addBusinessDays(hoje, diasVencimento)



        const novoPagamento = await database[this.nomeDoModelo].create(
            {
                pedido_ressuprimento_id: pPedidoRessuprimentoId,
                data_vencimento: dataVencimento,
                multa: multa
            },
            { transaction: pTransacao }
        )

        return novoPagamento
    }

    async realizaPagamentoRessuprimento(pPedidoRessuprimentoId, pDataAceitacao, pDataPagamento, pTipoPagamentoRessuprimento, pTransacao) {
        
        let multaTotal = 0.0

        const pagamento = await database[this.nomeDoModelo].findOne({ where: { pedido_ressuprimento_id: pPedidoRessuprimentoId }})
        if(!pagamento) {
            throw new Erro(404, 'Registro de pagamento não encontrado')
        }

        const dataPagamento = parse(pDataPagamento, 'dd/MM/yyyy', new Date())
        if(!isValid(dataPagamento)) {
            throw new Erro(400, 'Data inválida de pagamento')
        }

        if(isBefore(dataPagamento, pDataAceitacao)){
            throw new Erro(400, 'A data de pagamento não pode ser anterior a data de aceitação do pedido')
        }

        const inicioDiaPagamento = startOfDay(dataPagamento)
        const inicioDiaVencimento = startOfDay(pagamento.data_vencimento)
        if(isBefore(inicioDiaVencimento, inicioDiaPagamento)){
            const diasCorridos = differenceInDays(inicioDiaPagamento, inicioDiaVencimento)
            multaTotal = diasCorridos * pagamento.multa
        }

        let dados = {
            data_pagamento: dataPagamento,
            tipo_pagamento_ressuprimento: pTipoPagamentoRessuprimento,
            status_pagamento: 'Realizado'
        }

        const pagamentoRealizado = await database[this.nomeDoModelo].update(dados,
            {
                where: { id: Number(pagamento.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )

        return { 
            pagamentoRealizado: pagamentoRealizado,
            multaTotal: multaTotal
        }
    }

    async buscaPagamento(pPedidoRessuprimentoId) {
        return await database[this.nomeDoModelo].findOne({
            where: {
                pedido_ressuprimento_id: pPedidoRessuprimentoId
            }
        })
    }

}

module.exports = PagamentoRessuprimentoServices