const Sequelize = require('sequelize')
const connection = require('../../database/database')

// importando o model categoria para o relacionanmento
const Category = require('../categories/Category')
const User = require('../users/User')
//model artclies quer se relacionar com o model category

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) // (N para N)
Article.belongsTo(Category) // 1 article pertence a 1 categoria (1 para 1)

// Sincronizar esse model com os relacionamento com a tebela no bd
Article.sync({force: false})

module.exports = Article