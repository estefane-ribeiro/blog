const express = require('express')
const User = require('./User')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
  User.findAll().then(users => res.render('admin/users/index', { users }))
})

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  User.findOne({ where: { email: email } }).then(user => {
    if (user == undefined) {
      User.create({
        email: email,
        password: hash
      })
        .then(() => res.redirect('/'))
        .catch(() => res.redirect('/'))
    } else {
      res.send(`
        <div style="max-width: 70%; margin: 10rem auto">
          <div style="margin-bottom: 2rem">
            O Email <span style="color: #d7385e; font-weight: bold">${user.email}</span> já existe, faça login para continuar
          </div>
          <br>
          <div>
            Crie sua conta com um email diferente.
            <a href="/admin/users/create" style="background-color: #d7385e; padding: 1rem; color: #fff; border-radius: .2rem;" text-decoration: none;>Criar nova conta</a>
          </div>
        </div>
      `)
    }
  })
})

router.get('/login', (req, res) => {
  res.render('admin/users/login.ejs')
})

router.post('/authenticate', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if (user != undefined) {
    } else {
      res.send(`
        <div style="max-width: 70%; margin: 10rem auto">
          <div style="margin-bottom: 2rem">
            O e-mail não existe, ou está incorretos. 
          </div>
          <br>
          <div>
            Crie sua conta com um email diferente.
            <a href="/admin/users/create" style="background-color: #d7385e; padding: 1rem; color: #fff; border-radius: .2rem;" text-decoration: none;>Criar nova conta</a>
          </div>
        </div>
      `)
    }
  })
})

module.exports = router
