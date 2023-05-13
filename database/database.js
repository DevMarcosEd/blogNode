const Sequelize = require('sequelize')

const connection = new Sequelize('nomeDoBanco','root','suaSenha',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection