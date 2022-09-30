//Modules
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session') //biblioteca para genrenciar sessões
const connection = require('./database/database')
const flash = require('connect-flash')  //retorna um msg flash de erro ou sucesso

// Import Routes controller
const categoriesController = require('./models/categories/CategoriesController')
const articlesController = require('./models/articles/ArticlesController')
const usersController = require('./models/users/UsersController')

//Import models
const Category = require('./models/categories/Category')
const Article = require('./models/articles/Article')

// Configurações
    // Sessão
    app.use(session({
        secret: "purpleCat", // palavra que o express session utiliza para aumenta segurança das sessões
        cookie: {maxAge: 1200000}, //Não salva dados, vai dizer que o user tem uma sessão no servidor //tempo de expiração com max-age
        resave: false,
        saveUninitialized: false
    }))
    // definição do flash
    app.use(flash())
    
    // Middleware flash
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    //View engine
    app.set('view engine', 'ejs', {
        helpers: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YY')
            }
        }
    })

    //Static
    app.use(express.static('public'))

    //Body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('successful connection!')
    }).catch((error) => {
        console.log(error)
    })

// Router Controllers
app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

//Router Main - Listagem de todos os artigos // 4 por view
app.get('/', (req, res) => {
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 8
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        }) 
    })
})

//abrindo o artigo clicando no leia mais
app.get('/:slug', (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

//exibindo todos artigos que tenham um slug epeficico
app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug
    Category.findOne({ //pesquisando uma categoria pelo slug dela
        where: {
            slug: slug
        },
        include: [{model: Article}] //JOIN //quando busca a categoria, inclua todos os artigo que fazem parte dela
    }).then(category => {

        if(category!=undefined) {
            Category.findAll().then(categories => {
                res.render('slug', {articles: category.articles, categories: categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

// starting application
app.listen(8080, () => {
    console.log('The server is running!')
})