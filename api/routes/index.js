const bodyParser = require('body-parser')
const ressuprimento = require('./ressuprimentoRoute')
const fornecedor = require('./fornecedorRoute')
const deposito = require('./depositoRoute')

module.exports = app => {
    app.use(bodyParser.json(),
            ressuprimento,
            fornecedor,
            deposito
    )
}