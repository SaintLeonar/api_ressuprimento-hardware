const database = require('../models')

class Services {
    constructor(pNomeDoModelo){
        this.nomeDoModelo = pNomeDoModelo
    }

    async buscaUmRegistro(pId) {
        return database[this.nomeDoModelo].findOne( { where: { id: Number(pId) } } )
    }

    async buscaTodosRegistros(pId){
        return database[this.nomeDoModelo].findAll( { where: { id: Number(pId) } } )
    }
}

module.exports = Services