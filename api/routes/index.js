const bodyParser = require('body-parser')
const ressuprimento = require('./ressuprimentoRoute')
const fornecedor = require('./fornecedorRoute')
const deposito = require('./depositoRoute')
const notaFiscal = require('./notaFiscalRoute')

module.exports = app => {
    app.use(bodyParser.json(),
            ressuprimento,
            fornecedor,
            deposito,
            notaFiscal
    )
}