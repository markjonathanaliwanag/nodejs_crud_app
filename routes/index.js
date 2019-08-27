var express = require('express')
var app = express()

app.get('/', function(req, res){
    res.render('index', {title: 'NodeJS CRUD App with Express and MySQL'})
})

module.exports = app