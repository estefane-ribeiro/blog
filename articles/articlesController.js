const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/AdminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    include: [{ model: Category }]
  }).then(articles =>
    res.render('admin/articles/index', {
      articles
    })
  )
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories })
  })
})

router.post('/article/save', adminAuth, (req, res) => {
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

router.post('/articles/delete', adminAuth, (req, res) => {
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

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
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

router.post('/articles/update', adminAuth, (req, res) => {
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

router.get('/articles/page/:numPage',  (req, res) => {
  let page = req.params.numPage
  let offset = 0

  if (isNaN(page) || page == 1) {
    offset = 0
  } else {
    offset = (parseInt(page) - 1) * 5
  }

  Article.findAndCountAll({
    limit: 5,
    offset: offset,
    order: [['id', 'DESC']]
  }).then(articles => {
    let next
    if (offset + 5 >= articles.count) {
      next = false
    } else {
      next = true
    }

    let result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }

    Category.findAll().then(categories => {
      res.render('admin/articles/page', { result, categories })
    })
  })
})

module.exports = router
