var express = require('express')
var mysql = require('mysql')
var app = express()

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_crudapp_db',
    connectionLimit: 10,
    multipleStatements: true
})

app.get('/', function(req, res, next){
    req.getConnection(function(error, conn){
        pool.query("SELECT * FROM items ORDER by id DESC", function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('item/list', {
                    title: 'Item List',
                    data: ''
                })
            } else {
                res.render('item/list', {
                    title: 'Item List',
                    data: rows
                })
            }
        })
    })
})

module.exports = app