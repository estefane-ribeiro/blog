const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const categoriesController = require('./categories/categoriesController')
const articlesController = require('./articles/articlesController')
const usersController = require('./user/usersController')
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

// view engine
app.set('view engine', 'ejs')

// static
app.use(express.static('public'))

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// connection database
connection
  .authenticate()
  .then(() => console.log('Conectado ao banco de dados'))
  .catch(e => console.log(`Erro de autentificação com o banco: ${e}`))

// barra está sendo usado como prefixo, isso significa que antes da rota ele deve ser adicionado
app.use('/', categoriesController)

app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
    order: [['id', 'DESC']],
    limit: 5
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles, categories })
    })
  })
})

app.get('/:slug', (req, res) => {
  let slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render('article', { article, categories })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(() => res.redirect('/'))
})

app.get('/category/:slug', (req, res) => {
  const slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if (category != undefined) {
      Category.findAll().then(categories => {
        res.render('index', { articles: category.articles, categories })
      })
    } else {
      res.redirect('/')
    }
  })
})

app.listen(3000, () => console.log('Rodando'))
