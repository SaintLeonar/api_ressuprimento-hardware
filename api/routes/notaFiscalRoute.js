const { Router } = require('express')
const NotaFiscalController = require('../controllers/NotaFiscalController')

const router = Router()

router.post('/nota_fiscal', NotaFiscalController.emiteNotaFiscal)

module.exports = router