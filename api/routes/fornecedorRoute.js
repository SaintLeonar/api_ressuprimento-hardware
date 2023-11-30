const { Router } = require('express')
const FornecedorController = require('../controllers/fornecedorController')

const router = Router()

router.get('/fornecedores/:id', FornecedorController.getFornecedor)

module.exports = router