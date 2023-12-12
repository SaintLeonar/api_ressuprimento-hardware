const { ProdutoServices } = require('../services')
const produtoServices = new ProdutoServices()

class ProdutoController {
    
    static async getProduto(req, res) {
        const { id } = req.params
        try {
            const produto = await produtoServices.buscaUmRegistro(id)
            return res.status(200).json(produto)
        } catch (erro) {
            console.log(`erro: ${erro}`)
            return res.status(500).json(erro)
        }
    }

    static async getProdutoPorEan(req, res) {
        const { ean } = req.params
        try {
            const produto = await produtoServices.buscaProduto(String(ean))
            return res.status(200).json(produto)
        } catch (erro) {
            console.log(`erro: ${erro}`)
            return res.status(500).json(erro)
        }
    }
}

module.exports = ProdutoController