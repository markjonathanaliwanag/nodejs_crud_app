var express = require('express')
var app = express()

app.get('/', function(req, res, next){
    req.getConnection(function(error, conn){
        conn.query("SELECT * FROM items ORDER by id DESC", function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('item.list', {
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