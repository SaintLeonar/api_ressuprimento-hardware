const { Router } = require('express')
const RessuprimentoController = require('../controllers/RessuprimentoController')

const router = Router()

router.get('/pedido_ressuprimento/:id', RessuprimentoController.buscaUmPedidoRessuprimento)
router.post('/pedido_ressuprimento', RessuprimentoController.criaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/aceitar/:id', RessuprimentoController.aceitaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/pagamento/:id', RessuprimentoController.realizaPagamento)
router.patch('/pedido_ressuprimento/despacho/internacional/:id', RessuprimentoController.despachoInternacional)

module.exports = router