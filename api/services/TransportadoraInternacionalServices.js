const Services = require('./Services')
const database = require('../models')
const Erro = require('../errors/Erros')

class TransportadoraInternacionalServices extends Services {
    constructor() {
        super('Transportadora_Internacional')
    }

    /**
     * 
     * @param {*} pTransportadoraInternacionalId 
     * @param {*} pAlfandegaNacionalId 
     * @returns true se entregar e false se não entregar
     */
    async entregaAlfandegaNacional (pTransportadoraInternacionalId, pAlfandegaNacionalId) {
        const resposta = await database.Transportadora_Alfandega_Nacional.findOne({
            where: {
                transportadora_internacional_id: Number(pTransportadoraInternacionalId),
                alfandega_nacional: Number(pAlfandegaNacionalId)
            }
        })

        if(resposta) {
            return true
        }

        return false
    }

    /**
     * 
     * @param {*} pTransportadoraInternacionalId 
     * @param {*} pAlfandegaNacionalId 
     * @returns true se entregar e false se não entregar
     */
    async entregaAlfandegaInternacional (pTransportadoraInternacionalId, pAlfandegaInternacionalId) {
        const resposta = await database.Transportadora_Alfandega_Internacional.findOne({
            where: {
                transportadora_internacional_id: Number(pTransportadoraInternacionalId),
                alfandega_internacional_id: Number(pAlfandegaInternacionalId)
            }
        })

        if(resposta) {
            return true
        }

        return false
    }

    /**
     * 
     * @param {*} pTransportadoraInternacionalId 
     * @param {*} pAlfandegaNacionalId 
     * @returns true se entregar e false se não entregar
     */
    async entregaAlfandegaNacional (pTransportadoraInternacionalId, pAlfandegaNacionalId) {
        const resposta = await database.Transportadora_Alfandega_Nacional.findOne({
            where: {
                transportadora_internacional_id: Number(pTransportadoraInternacionalId),
                alfandega_nacional_id: Number(pAlfandegaNacionalId)
            }
        })

        if(resposta) {
            return true
        }

        return false
    }
}

module.exports = TransportadoraInternacionalServices