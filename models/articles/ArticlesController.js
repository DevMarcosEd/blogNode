const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../../middlewares/adminAuth')

router.get('/articles', adminAuth, (req, res) => {
    // Article.findAll({
    //     include: [{model: Category}]
    // }).then(articles => {
    //     res.render('admin/articles/index', {articles: articles})
    // })
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('admin/articles/index', {articles: articles, categories: categories})
        })
    })
})


router.get('/articles/newArticles', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/newArticles', {categories: categories})
    })
})

// Rota de cadastro de artigos
router.post('/articles/save', adminAuth, (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        req.flash('success_msg', 'Artigo criado com sucesso!')
        res.redirect('/articles')
    })
})

//ROTA DELETE
router.post('/articles/delet', adminAuth, (req, res) => {
    let id = req.body.id
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success_msg', 'Artigo deletado com sucesso!')
                res.redirect('/articles')
            })
        } else { // SE NÃO FOR UM NUMBER
            res.redirect('/articles')
        }
    } else { // NULL
        res.redirect('/articles')
    }
})

//EDITAR
router.get('/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/articles')
    }
    Article.findByPk(id).then(article => { //pesquisando artigo pelo id  
        if(article != undefined) {

            Category.findAll().then(categories => {

                res.render('admin/articles/edit', {article: article, categories: categories})

            })
        } else {
            res.redirect('/articles')
        }
    }).catch(err => {
        res.redirect('/articles')
    })
})

//ATUALIZANDO EDIÇÃO
router.post('/articles/update', adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    if(title != undefined && body != undefined && category != undefined) {
        Article.update({title: title,slug: slugify(title), body: body, categoryId: category}, {
            where: {
                id: id
            }
        }).then(() => {
            req.flash('success_msg', 'Artigo editado com sucesso!')
           res.redirect('/articles') 
        })
    } 
})

//ROTA Paginação
router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num
    let offset = 0

    // 1 = 0 - 3 (artigo ind 0 ate o artigo ind 3)
    // 2 = 4 - 7
    // 3 = 8 - 11
    // 4 = 12 - 15

    if(isNaN(page) || page == 1) { //offset for igual a 1, começar a exibir os artigos a partir do idice 0
        offset = 0
    }else {
        offset = (parseInt(page) -1) * 8 
    }

    //pesquisar todos os elementos do bd e retornar uma quantidade de quantos elementos existem na tabela
    Article.findAndCountAll({
        limit: 8,
        offset: offset, // retornar dados a partir de um valor
        order:[
            ['id', 'DESC']
        ] 
    }).then(articles => {

        let next
        if(offset + 4 >= articles.count) { //se meu offset + a quantidade de elementos que tenho na pagina (4) for maior do que a contagem total de artigos
            next = false
        } else {
            next = true
        }
        // variavel mostra se existe outra pagina a ser exibida, dependendo da pagina que estou
        
        let result = { 
            page: parseInt(page),
            next: next,
            articles: articles //receber os artigos que recebo na busca
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        })

    })
})

module.exports = router