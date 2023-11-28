const Services = require('./Services')
const database = require('../models')
const ProdutoServices = require('./ProdutoServices')
const ItemPedidoFornecedorServices = require('./ItemPedidoFornecedorServices')

class RessuprimentoServices extends Services {
    constructor() {
        super('Pedido_Ressuprimento')
        this.produtos = new ProdutoServices()
        this.itemPedidoFornecedor = new ItemPedidoFornecedorServices()
    }

    async criaNovoPedidoRessuprimento(pFornecedorId, pDepositoId, pProdutos) {

        // CRIA UM NOVO REGISTRO DE PEDIDO DE RESSUPRIMENTO
        const novoPedido = await database[this.nomeDoModelo].create(
            {
                data_pedido: new Date(),
                fornecedor_id: pFornecedorId,
                deposito_id: pDepositoId
            }
        )

        // ITERA SOBRE OS PRODUTOS
        for(const produtoInfo of pProdutos) {
            const { ean, quantidade_pedida, preco_acordado } = produtoInfo;

            // BUSCA PELO PRODUTO COM O EAN INFORMADO
            const produto = await this.produtos.buscaProduto(ean)
            
            // CRIA UM NOVO ITEM_PEDIDO_FORNECEDOR
            this.itemPedidoFornecedor.criaItemPedidoFornecedor(quantidade_pedida, preco_acordado, produto.id, novoPedido.id)
        }

        return novoPedido
    }
}

module.exports = RessuprimentoServices