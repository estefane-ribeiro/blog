const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/articles', (req, res) => {
  res.send('Rota articles criada')
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories })
  })
})

router.post('/article/save', (req, res) => {
  let title = req.body.title
  let articleText = req.body.article
  let category = req.body.category

  Article.create({
    title: title,
    slug: slugify(title),
    body: articleText,
    categoryId: category
  })
})

module.exports = router
