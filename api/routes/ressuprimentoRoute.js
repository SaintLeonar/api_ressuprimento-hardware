const { Router } = require('express')
const RessuprimentoController = require('../controllers/RessuprimentoController')

const router = Router()

router.get('/pedido_ressuprimento/:id', RessuprimentoController.buscaUmPedidoRessuprimento)
router.post('/pedido_ressuprimento', RessuprimentoController.criaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/aceitar/:id', RessuprimentoController.aceitaPedidoRessuprimento)
router.patch('/pedido_ressuprimento/pagamento/:id', RessuprimentoController.realizaPagamento)
router.patch('/pedido_ressuprimento/despacho/internacional/:id', RessuprimentoController.despachoInternacional)
router.patch('/pedido_ressuprimento/chegada_alfandega/:id', RessuprimentoController.chegadaAlfandega)
router.patch('/pedido_ressuprimento/liberacao_alfandega/:id', RessuprimentoController.liberacaoAlfandega)
router.patch('/pedido_ressuprimento/despacho/nacional/:id', RessuprimentoController.despachoNacional)
router.patch('/pedido_ressuprimento/entrega/:id', RessuprimentoController.entregaPedido)
router.patch('/pedido_ressuprimento/recebimento/:id', RessuprimentoController.recebimentoProdutos)

module.exports = router