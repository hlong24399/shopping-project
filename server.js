// Dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");

const Product = require('./models/products.js');
const productSeed = require('./models/productSeed');
// DATABASE CONFIGURATION
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// MIDDLEWARE  & BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));


app.get("/", (req, res) => {
    res.redirect('/products');
});

app.get('/products/seed', (req, res) => {
    Product.deleteMany({}, (error, allProduct) => {});

    Product.create(productSeed, (error, data) => {
        console.log(error);
        console.log(data);
        res.redirect('/products');
    });
});
app.get('/products', (req, res) => {
    Product.find({}, (error, allProduct) => {
        res.render('index.ejs', {
            product: allProduct,
		});
	});
});

app.post('/products', (req, res) => {
    Product.create(req.body, (error, createdProduct) => {
        console.log(error);
        // res.send(createdProduct);
        res.redirect("/products");
    });
})

app.get('/products/new', (req, res) => {
    res.render('new.ejs');
});

app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('show.ejs', {
            product: foundProduct,
        });
    }); 
});

app.get('/products/edit/:id', (req, res) => {
    Product.findById(req.params.id, (error, product) => {
        if (error)
        {
            console.log(error);
        }
        res.render('edit.ejs', {product: product});
    })
})

app.post('/product/edit', (req, res) => {
    id = req.body.id;
    Product.findByIdAndUpdate(id, req.body, (error, product) => {
        if (error)
        {
            res.send(error);
        }
        else
        {
            res.render("show.ejs", {product: product});
        }
    })
});


// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`));