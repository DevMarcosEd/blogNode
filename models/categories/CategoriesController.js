const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const adminAuth = require('../../middlewares/adminAuth')


// Rota main de categoria
router.get('/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories})
    })
})

// Rota de cadastro de categoria
router.get('/categories/newCategories', adminAuth, (req, res) => {
    res.render('admin/categories/newCategories')
})

router.post('/categories/save', adminAuth, (req, res) => {
    let title = req.body.title

    Category.findOne({where:{title: title}}).then( category => {
        if(category == undefined){
        
                let title = req.body.title
                let erros = []
                const regex = /[0-9]/;

                if(!title) {
                    erros.push({message: 'Não aceitamos espaços em branco!'})
                }

                if(regex.test(title)) {
                    erros.push({message: 'Não será aceito números, tente novamente!'})
                }

                if(title.length <= 2) {
                    erros.push({message: 'Texto muito pequeno!'})
                }

                if(erros.length > 0) {
                    req.flash('error_msg', 'Houve um erro ao criar a categoria, tente novamente!')
                    res.redirect('/categories/newCategories')
                    
                } else {
                    Category.create({
                        title: title,
                        slug: slugify(title) //versão do titulo otimizada para URL
                    }).then(() => {
                        req.flash('success_msg', 'Categoria criada com sucesso!')
                        res.redirect('/categories')
                    })
                }
        
        } else {
            req.flash('error_msg', 'Categoria já cadastrada no banco de dados!')
            res.redirect('/categories/newCategories')
        }
    })
})

//ROTA DELETE
router.post('/categories/delet', adminAuth, (req, res) => {
    let id = req.body.id
    if(id != undefined) {
        if(!isNaN(id))  { 
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                console.log('Deletado com sucesso!')
                res.redirect('/categories')
            })
        } else { // SE NÃO FOR UM NUMBER
            res.redirect('/categories')
        }
    } else { // NULL
        res.redirect('/categories')
    }
})

//ROTA EDIT 
router.get('/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    if(isNaN(id)){
        res.redirect('/categories')
    }

    Category.findByPk(id).then(category => { //pesquisar categoria pelo id
        if(category != undefined) {
            res.render('admin/categories/editCategory', {category: category})
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(err => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/updateCategory', adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title

    Category.update({title: title, slug: slugify(title)}, { //atulizar um categoria pelo id
        where: {
            id: id
        }
    }).then(() => {
        console.log('Categoria editada com sucesso!')
        res.redirect('/categories')
    })

})


module.exports = router