const express = require('express')
const router = express.Router()

router.get('/categories', (req, res) => {
  res.send('Rota categories criada')
})

router.get('/admin/categories/new', (req, res) => {
  res.send('Criando uma nova categoria!')
})

module.exports = router
