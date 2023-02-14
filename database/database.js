const Sequelize = require('sequelize')

const connection = new Sequelize('blog', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

module.exports = connection
