const express = require('express')
const router = express.Router()

router.get('/articles', (req, res) => {
  res.send('Rota articles criada')
})

router.get('/admin/articles/new', (req, res) => {
  res.send('Criando uma nova categoria!')
})

module.exports = router
