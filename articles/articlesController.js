const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    include: [{ model: Category }]
  }).then(articles =>
    res.render('admin/articles/index', {
      articles
    })
  )
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
  }).then(() => res.redirect('/admin/articles'))
})

router.post('/articles/delete', (req, res) => {
  const id = req.body.id
  if (id != undefined && !isNaN(id)) {
    Article.destroy({
      where: {
        id: id
      }
    }).then(() => res.redirect('/admin/articles'))
  } else {
    res.redirect('/admin/articles')
  }
})

router.get('/admin/articles/edit/:id', (req, res) => {
  let id = req.params.id
  if (isNaN(id)) {
    res.redirect('/admin/articles')
  }
  Article.findByPk(id).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        res.render('admin/articles/edit', { article, categories })
      })
    }
  })
})

router.post('/articles/update', (req, res) => {
  let id = req.body.id
  let title = req.body.title
  let article = req.body.article
  let categoryId = req.body.categoryId

  Article.update(
    {
      title: title,
      body: article,
      slug: slugify(title),
      categoryId: categoryId
    },
    {
      where: {
        id: id
      }
    }
  )
    .then(() => res.redirect('/admin/articles'))
    .catch(() => res.redirect('/admin/articles'))
})

router.get('/articles/page/:numPage', (req, res) => {
  let page = req.params.numPage
  let offset = 0

  if (isNaN(page) || page == 1) {
    offset = 0
  } else {
    offset = parseInt(page) * -1 * 5
  }

  Article.findAndCountAll({
    limit: 5,
    offset: offset,
    order: [['id', 'DESC']]
  }).then(articles => {
    let next = 0
    if (offset + 5 >= articles.count) {
      next = false
    } else {
      next = true
    }

    let result = {
      next: next,
      articles: articles
    }
    res.json(result)
  })
})

module.exports = router
