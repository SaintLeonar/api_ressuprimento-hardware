const { Router } = require('express')
const DepositoController = require('../controllers/DepositoController')

const router = Router()

router.get('/depositos/:id', DepositoController.getDeposito)

module.exports = router