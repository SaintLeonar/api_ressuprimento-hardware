const bodyParser = require('body-parser')
const ressuprimento = require('./ressuprimentoRoute')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(ressuprimento)
}