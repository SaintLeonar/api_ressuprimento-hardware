const { Router } = require('express')
const RessuprimentoController = require('../controllers/ressuprimentoController')

const router = Router()

router.post('/pedido_ressuprimento', RessuprimentoController.criaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/aceitar/:id', RessuprimentoController.aceitaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/pagamento/:id', RessuprimentoController.realizaPagamento)

module.exports = router