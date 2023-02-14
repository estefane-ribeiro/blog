const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const categoriesController = require('./categories/categoriesController')
const articlesController = require('./articles/articlesController')
const Article = require('./articles/Article')
const Category = require('./categories/Category')

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

app.get('/', (req, res) => res.render('index'))

app.listen(3000, () => console.log('Rodando'))