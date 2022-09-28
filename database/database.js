const Sequelize = require('sequelize')

const connection = new Sequelize('nomedoBanco','nomeUser','senha',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection