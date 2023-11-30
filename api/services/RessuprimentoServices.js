const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')
const ProdutoServices = require('./ProdutoServices')
const ItemPedidoFornecedorServices = require('./ItemPedidoFornecedorServices')
const FornecedorServices = require('./FornecedorServices')
const DepositoServices = require('./DepositoServices')

class RessuprimentoServices extends Services {
    constructor() {
        super('Pedido_Ressuprimento')
        this.produtos = new ProdutoServices()
        this.itemPedidoFornecedor = new ItemPedidoFornecedorServices()
        this.fornecedor = new FornecedorServices()
        this.deposito = new DepositoServices()
    }

    async criaNovoPedidoRessuprimento(pFornecedorId, pDepositoId, pProdutos, pTransacao) {

        const fornecedor = await this.fornecedor.buscaUmRegistro(pFornecedorId)
        if(!fornecedor) {
            throw new Erro(404, 'Fornecedor não encontrado na base')
        }
        const deposito = await this.deposito.buscaUmRegistro(pDepositoId)
        if(!deposito) {
            throw new Erro(404, 'Depósito não encontrado na base')
        }

        // CRIA UM NOVO REGISTRO DE PEDIDO DE RESSUPRIMENTO
        const novoPedido = await database[this.nomeDoModelo].create(
            {
                data_pedido: new Date(),
                fornecedor_id: pFornecedorId,
                deposito_id: pDepositoId
            },
            { transaction: pTransacao }
        )

        // Caberia aqui testar se a lista de produtos está vazia.

        // ITERA SOBRE OS PRODUTOS
        for(const produtoInfo of pProdutos) {
            const { ean, quantidade_pedida, preco_acordado } = produtoInfo;

            // BUSCA PELO PRODUTO COM O EAN INFORMADO
            const produto = await this.produtos.buscaProduto(ean)
            if(!produto) {
                throw new Erro(404, 'EAN não encontrado na base')
            }
            
            // CRIA UM NOVO ITEM_PEDIDO_FORNECEDOR
            await this.itemPedidoFornecedor.criaItemPedidoFornecedor(quantidade_pedida, preco_acordado, produto.id, novoPedido.id, pTransacao)
        }

        return novoPedido
    }
}

module.exports = RessuprimentoServices