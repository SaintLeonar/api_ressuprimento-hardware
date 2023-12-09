const Services = require('./Services')
const database = require('../models')

class ProdutoServices extends Services {
    constructor() {
        super('Produtos')
    }

    async buscaProduto(pEan) {
        return await database[this.nomeDoModelo].findOne({
            where: {
                ean: String(pEan)
            }
        })
    }

    async recebeProdutos(pProduto, pQuantidadeRecebida, pPrecoCompra, pTransacao) {
        const quantidadeAtualizada = pProduto.quantidade + pQuantidadeRecebida

        let dados = {
            quantidade: quantidadeAtualizada,
            preco_compra: pPrecoCompra
        }

        return await database[this.nomeDoModelo].update(dados, 
            {
                where: { id: Number(pProduto.id) },
                individualHooks: true,
                transaction: pTransacao
            }
        )
    }
}

module.exports = ProdutoServices