const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')
const RessuprimentoServices = require('./RessuprimentoServices')
const ItemNotaFiscalServices = require('./ItemNotaFiscalServices')
const faker = require('faker')
const { parse, isValid } = require('date-fns');

class NotaFiscalServices extends Services {
    constructor() {
        super('Nota_Fiscal')
        this.pedidoRessuprimento = new RessuprimentoServices()
        this.itemNotaFiscal = new ItemNotaFiscalServices()
    }

    async emiteNotaFiscal(pPedidoRessuprimentoId, pDataEmissao, pDataRecebimento, pTransacao) {
        const pedido = await this.pedidoRessuprimento.buscaUmRegistro(pPedidoRessuprimentoId)
        if(!pedido) {
            throw new Erro(404, 'Pedido de Ressuprimento não encontrado na base')
        }

        // Esse caso não estava descrito
        // Se o estado for 'Em preparação' significa que o pedido foi pago
        // Então decidi não validar se existe um pagamento para esse pedido
        if(pedido.status_pedido_ressuprimento !== 'Em preparação') {
            throw new Erro(400, 'Status do pedido é diferente de: Em preparação')
        }

        // Esse caso não estava descrito
        const notaFiscal = await database[this.nomeDoModelo].findOne({
            where: {
                pedido_ressuprimento_id: Number(pedido.id)
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

        // Gera um identificar NF-e ficticio para fins de testes
        const NFe_Ficticio = faker.datatype.uuid()

        // CRIA NOTA FISCAL
        const novaNotaFiscal = await database[this.nomeDoModelo].create(
            {
                identificador: NFe_Ficticio,
                data_emissao: dataEmissao,
                data_recebimento: dataRecebimento,
                pedido_ressuprimento_id: pPedidoRessuprimentoId
            },
            { transaction: pTransacao }
        )

        const produtos =  await this.pedidoRessuprimento.buscaProdutosPedido(pPedidoRessuprimentoId)

        // CRIA ITEM NOTA FISCAL
        await this.itemNotaFiscal.criaItemNotaFiscal(novaNotaFiscal.id, produtos, pTransacao)

        return novaNotaFiscal
    }
}

module.exports = NotaFiscalServices