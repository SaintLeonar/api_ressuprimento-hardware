const { DepositoServices } = require('../services')
const depositoServices = new DepositoServices()

class DepositoController {
    
    static async getDeposito(req, res) {
        const { id } = req.params
        try {
            const Deposito = await depositoServices.buscaUmRegistro(id)
            return res.status(200).json(Deposito)
        } catch (erro) {
            console.log(`erro: ${erro}`)
            return res.status(500).json(erro)
        }
    }
}

module.exports = DepositoController