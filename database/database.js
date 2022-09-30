const Sequelize = require('sequelize')

const connection = new Sequelize('tecnoblog','root','Ola.23801952',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection