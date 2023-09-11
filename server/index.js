const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/productModel')

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//route
app.get('/', (req, res) => {
    res.send('Hello Node API')
})


//get data from MongoDB
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//update a product
app.put('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message});

    }
})


//get data from MongoDB by ID
app.get('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//insert data to mongoDB
app.post('/products', async (req, res) =>{
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

//delete data from MongoDB
app.delete('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

})


mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://@cluster0.u6lz7qs.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to MongoDB')
    app.listen(3001, ()=>{
        console.log("server is running port 3001")
    })
    
}).catch((error)=>{
    console.log(error)
})
