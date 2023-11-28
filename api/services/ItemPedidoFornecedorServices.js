const Services = require('./Services')
const database = require('../models')

class ItemPedidoFornecedorServices extends Services {
    constructor() {
        super('Item_Pedido_Fornecedor')
    }

    async criaItemPedidoFornecedor(pQuantidadePedida, pPrecoAcordado, pProdutoId, pPedidoRessuprimentoId){
        await database[this.nomeDoModelo].create(
            {
                quantidade_pedida: pQuantidadePedida,
                preco_acordado: pPrecoAcordado,
                produto_id: pProdutoId,
                pedido_ressuprimento_id: pPedidoRessuprimentoId
            }
        )
    }
}

module.exports = ItemPedidoFornecedorServices