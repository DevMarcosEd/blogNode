const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const Category = require('../categories/Category')

const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'marcosedaraujo@gmail.com',
        pass: 'ectenzlvvnahbgby'
    }
})

router.get('/users', (req, res) => {
    User.findAll().then(users => {
        res.render('users/index', {users: users})
    })
})

// Rota de Cadastro
router.get('/users/create', (req, res) => {
    Category.findAll().then(categories => {
        res.render('users/createUsers', {categories: categories})
    })
})

router.post('/users/createUser', (req, res) => {
    let name = req.body.name
    let lastname= req.body.lastname
    let email = req.body.email
    let password = req.body.password
    
    if(password.length < 6) {
        req.flash('error_msg', 'Senha muito curta! crie uma senha com mais de 6 caracteres.')
        res.redirect('/users/create')
    } else {
        User.findOne({where:{email: email}}).then( user => {

            if(user == undefined){
                let salt = bcrypt.genSaltSync(10) // salt - "tempero" a mais para colocar no rash para aumentar a segurança
                let hash = bcrypt.hashSync(password, salt)
    
                User.create({
                    name: name,
                    lastname: lastname,
                    email: email,
                    password: hash
                }).then(() => {
                    req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                    res.redirect('/')
                }).catch((err) => {
                    res.redirect('/users/create')
                })
    
            } else {
                req.flash('error_msg', 'Usuário já cadastrado!')
                res.redirect('/users/create')
            }
        })
    }

})

// Rota de login
router.get('/login', (req, res) => {
    Category.findAll().then(categories => {
        res.render('users/login', {categories: categories})
    })
})

router.post('/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user != undefined) { //se existe um usuario com esse email
            // validar senha
            let correct = bcrypt.compareSync(password, user.password) // comparando hash de senha
            
            if(correct) {

                req.session.user = {
                    id: user.id,
                    email: user.email,
                    eAdmin: user.eAdmin,
                }
                // res.json(req.session.user)
                res.redirect('/articles')
            } else {
                req.flash('error_msg', 'Senha incorreta!')
                res.redirect('/login')
                
            }
        } else {
            req.flash('error_msg', 'Email incorreto!')
            res.redirect('/login')
        }
    })
})

router.get('/esqueciSenha', (req, res) => {
    res.render('users/recuperarSenha')
})

router.post('/enviandoNovaSenha', (req, res) => {

    let email = req.body.email
    let newPassword = Math.random().toString(36)
    

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(newPassword, salt)
    
    User.findOne({where: { email:email}}).then(userEmail => {

        if(userEmail != undefined) {
            User.update({password: hash}, {
                where: {
                    email: email
                }
            }).then(() => {
                transporter.sendMail({
                    from: 'Marcos Eduardo <seuemail@gmail.com>',
                    to: email,
                    subject: 'Sua nova senha:',
                    text: newPassword
                }).then(message => {
                    console.log(message)
                }).catch(err => {
                    console.log(err)
                })
        
               req.flash('success_msg', 'Nova senha enviada para seu e-mail!')
               res.redirect('/login')
            })
        } else {
            req.flash('error_msg','Email não cadastrado em nosso site')
            res.redirect('/login')
        }

    }).catch(err => {
        console.log(err)
    })
    
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router