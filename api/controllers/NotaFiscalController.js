const Erro = require('../errors/Erros')
const { sequelize } = require('../models')
const { NotaFiscalServices } = require('../services')
const notaFiscalServices = new NotaFiscalServices()

class NotaFiscalController {
    
    /**
     * 
     *  Implementação do Caso de Uso UC11 - Emissão Nota Fiscal (Internacional e Nacional)
     * 
     *  Possível refatoramento: Verificar se já existe pagamento para esse pedido.
     * 
     */
    static async emiteNotaFiscal(req, res) {
        let trans = await sequelize.transaction()
        try {
            const contentType = req.headers['content-type']
            if (!contentType || !contentType.includes('application/json')) {
                throw new Erro(415, 'O content-type da requisição deve ser application/json')
            }

            const { pedido_ressuprimento_id, data_emissao, data_recebimento } = req.body

            const notaFiscal = await notaFiscalServices.emiteNotaFiscal(pedido_ressuprimento_id, data_emissao, data_recebimento, trans)

            await trans.commit()
            return res.status(201).json({
                message: 'Nota emitida com sucesso',
                info: notaFiscal
            })
        } catch (erro) {
            if(trans) { 
                await trans.rollback()
            }
            return res.status(erro.statusCode || 500).json({ error: erro.message } || 'Erro interno do servidor')
        }
    }
}

module.exports = NotaFiscalController