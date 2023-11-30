class Erros extends Error {
    constructor(pStatusCode, pMessage) {
        super()
        this.statusCode = pStatusCode
        this.message = pMessage
    }
}

module.exports = Erros