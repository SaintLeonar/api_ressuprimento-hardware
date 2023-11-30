const { FornecedorServices } = require('../services')
const fornecedorServices = new FornecedorServices()

class FornecedorController {
    
    static async getFornecedor(req, res) {
        const { id } = req.params
        try {
            const fornecedor = await fornecedorServices.buscaUmRegistro(id)
            return res.status(200).json(fornecedor)
        } catch (erro) {
            console.log(`erro: ${erro}`)
            return res.status(500).json(erro)
        }
    }
}

module.exports = FornecedorController