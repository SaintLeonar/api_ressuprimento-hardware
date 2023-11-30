const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')

class ItemPedidoFornecedorServices extends Services {
    constructor() {
        super('Item_Pedido_Fornecedor')
    }

    async criaItemPedidoFornecedor(pQuantidadePedida, pPrecoAcordado, pProdutoId, pPedidoRessuprimentoId, pTransacao){

        if(pQuantidadePedida <= 0.0) {
            throw new Erro(400, 'Quantidade pedida inválida')
        }

        if(pPrecoAcordado <= 0.0) {
            throw new Erro(400, 'Preço acordado inválido')
        }

        await database[this.nomeDoModelo].create(
            {
                quantidade_pedida: pQuantidadePedida,
                preco_acordado: pPrecoAcordado,
                produto_id: pProdutoId,
                pedido_ressuprimento_id: pPedidoRessuprimentoId
            },
            {
                transaction: pTransacao
            }
        )
    }
}

module.exports = ItemPedidoFornecedorServices