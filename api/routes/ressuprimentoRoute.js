const { Router } = require('express')
const RessuprimentoController = require('../controllers/ressuprimentoController')

const router = Router()

router.post('/pedido_ressuprimento', RessuprimentoController.criaPedidoRessuprimento)

module.exports = router