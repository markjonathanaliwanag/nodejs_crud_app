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

// GET ITEMS FROM DB
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

// RENDER VIEW FOR ADD ITEM
app.get('/add', function(req, res, next){
    res.render('item/add', {
        title: 'Add New User',
        name: '',
        qty: '',
        amount: ''
    })
})

// INSERT ITEM TO DB
app.post('/add', function(req, res, next){
    
    // NOT WORKING
    // res.assert('name', 'Name is required').notEmpty()
    // res.assert('qty', 'Quantity is required').notEmpty()
    // res.assert('amount', 'Name is required').notEmpty()

    // var errors = req.getValidationResult()

    // if(!errors){
        var item = {
            // name: req.name,
            // qty: req.qty,
            // amount: req.amount

            name: req.body.name,
            qty: req.body.qty,
            amount: req.body.amount
        }

        req.getConnection(function(error, conn){
            pool.query("INSERT INTO items SET ?", item, function(err, result){
                if(err){
                    req.flash('error', err)
                    res.render('item/add', {
                        title: 'Add New Item',
                        name: item.name,
                        qty: item.qty,
                        amount: item.amount,
                    })
                } else {
                    req.flash('success', 'Item added successfully!')
                    res.render('item/add', {
                        title: 'Add New Item',
                        name: '',
                        qty: '',
                        amount:'',
                    })
                }
            })
        })
    // } else {
    //     var error_msg = ''
    //     errors.forEach(function(error){
    //         error_msg += error_msg + '<br/>'
    //     })

    //     req.flash('error', error_msg)

    //     res.render('item/add', {
    //         title: 'Add New Item',
    //         name: req.body.name,
    //         qty: req.body.age,
    //         amount: req.body.amount,
    //     })
    // }
})

// GET AN ITEM FOR UPDATE
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn){
        pool.query("SELECT * FROM items WHERE id = " + req.params.id, function(err, rows, fields){
            if(err) throw err

            if(rows.length <= 0){
                req.flash('error', 'Item not found!')
                res.redirect('/items')
            } else {
                res.render('item/edit', {
                    title: 'Edit Item',
                    id: rows[0].id,
                    name: rows[1].name,
                    qty: rows[2].qty,
                    amount: rows[3].amount
                })
            }
        })
    })
})

// UPDATE AN ITEM
app.put('/edit/(:id)', function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()
    req.assert('qty', 'Quantity is required').notEmpty()
    req.assert('amount', 'Name is required').notEmpty()

    var errors = req.validationErrors()

    if(!errors){
        var item = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('qty').escape().trim(),
            email: req.sanitize('amount').escape().trim()
        }

        req.getConnection(function(error, conn){
            pool.query("UPDATE items SET ? WHERE id = " + req.params.id, item, function(err, result){
                if(err){
                    req.flash('error', err)
                    res.render('item/edit', {
                        title: 'Edit Item',
                        id: req.params.id,
                        name: req.params.name,    
                        qty: req.params.qty,
                        amount: req.params.amount,
                    })
                } else {
                    req.flash('success', 'Item Updated Successfully!')
                    res.render('item/edit', {
                        title: 'Edit Item',
                        id: req.params.id,
                        name: req.params.name,    
                        qty: req.params.qty,
                        amount: req.params.amount,
                    })
                }
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function(error){
            error_msg += error_msg + '<br/>'
        })

        req.flash('error', error_msg)

        res.render('item/edit', {
            title: 'Edit Item',
            name: req.body.name,
            qty: req.body.age,
            amount: req.body.amount,
        })
    }
})

// DELETE AN ITEM
app.delete('/delete/(:id)', function(req, res, next){
    var item = {id: req.params.id}

    req.getConnection(function(error, conn){
        pool.query("DELETE FROM items WHERE id = " + req.params.id, item, function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.redirect('/items')
            } else {
                req.flash('success', 'Item Deleted!')
                res.redirect('/items')
            }
        })
    })
})

module.exports = app