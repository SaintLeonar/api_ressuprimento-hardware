const { Router } = require('express')
const ProdutoController = require('../controllers/ProdutoController')

const router = Router()

router.get('/produtos/:id', ProdutoController.getProduto)
router.get('/produtos/ean/:ean', ProdutoController.getProdutoPorEan)

module.exports = router