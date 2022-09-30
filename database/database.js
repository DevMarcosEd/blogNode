const Sequelize = require('sequelize')

const connection = new Sequelize('nomeBanco','nomeUser','Senha',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection