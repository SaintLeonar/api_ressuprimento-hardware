const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')
const ItemNotaFiscalServices = require('./ItemNotaFiscalServices')
const PagamentoRessuprimentoServices = require('./PagamentoRessuprimentoServices')
const faker = require('faker')
const { parse, isValid, isBefore, isAfter } = require('date-fns');

class NotaFiscalServices extends Services {
    constructor() {
        super('Nota_Fiscal')
        this.itemNotaFiscal = new ItemNotaFiscalServices()
        this.pagamento = new PagamentoRessuprimentoServices()
    }

    async emiteNotaFiscal(pPedido, pProdutos, pDataEmissao, pDataRecebimento, pTransacao) {

        if(pPedido.status_pedido_ressuprimento !== 'Em preparação') {
            throw new Erro(400, 'Status do pedido é diferente de: Em preparação')
        }

        const pagamento = await this.pagamento.buscaPagamento(pPedido.id)
        if(!pagamento) {
            throw new Erro(404, 'Pagamento não identificado para esse pagamento')
        }

        const notaFiscal = await database[this.nomeDoModelo].findOne({
            where: {
                pedido_ressuprimento_id: Number(pPedido.id)
            }
        })
        if(notaFiscal) {
            throw new Erro(400, 'Nota fiscal já emitida para esse pedido')
        }

        const dataEmissao = parse(pDataEmissao, 'dd/MM/yyyy', new Date())
        if(!isValid(dataEmissao)) {
            throw new Erro(400, 'Data inválida de emissão')
        }

        const dataRecebimento = parse(pDataRecebimento, 'dd/MM/yyyy', new Date())
        if(!isValid(dataRecebimento)) {
            throw new Erro(400, 'Data inválida de recebimento')
        }

        if(isBefore(dataEmissao,pagamento.data_pagamento)){
            throw new Erro(400, 'Data de emissão não pode ser anterior a data de pagamento do ressuprimento')
        }

        if(!isAfter(dataRecebimento, dataEmissao)) {
            throw new Erro(400, 'Data de recebimento deve ser superior a data de emissão')
        }

        // Gera um identificar NF-e ficticio para fins de testes
        const NFe_Ficticio = faker.datatype.uuid()

        // CRIA NOTA FISCAL
        const novaNotaFiscal = await database[this.nomeDoModelo].create(
            {
                identificador: NFe_Ficticio,
                data_emissao: dataEmissao,
                data_recebimento: dataRecebimento,
                pedido_ressuprimento_id: pPedido.id
            },
            { transaction: pTransacao }
        )

        // CRIA ITEM NOTA FISCAL
        await this.itemNotaFiscal.criaItemNotaFiscal(novaNotaFiscal.id, pProdutos, pTransacao)

        return novaNotaFiscal
    }

    async buscaNotaFiscal(pPedidoRessuprimentoId) {
        return await database[this.nomeDoModelo].findOne({
            where: {
                pedido_ressuprimento_id: pPedidoRessuprimentoId
            }
        })
    }
}

module.exports = NotaFiscalServices