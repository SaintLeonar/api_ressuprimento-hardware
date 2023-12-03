const Services = require('./Services')
const database = require('../models')

class ProdutoServices extends Services {
    constructor() {
        super('Produtos')
    }

    async buscaProduto(pEan) {
        return database[this.nomeDoModelo].findOne({
            where: {
                ean: String(pEan)
            }
        })
    }
}

module.exports = ProdutoServices