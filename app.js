const express = require('express')
const { randomUUID } = require("crypto")
const fs = require('fs')

const app = express()
app.use(express.json())

function addORUpdateProduct(){
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err) {
            console.error(err)
        } else {
            console.log("Product.json updated")
        }
    })
}

let products = []
const productsPath = "./products.json"
const productsExist = fs.existsSync(productsPath)
if(!productsExist){
    fs.writeFile("./products.json", JSON.stringify(products), (err) => {
        if(err){
            console.error(err)
        }
    })
}

fs.readFile("products.json", "utf8", (err, data) => {
    if(err) {
        console.error(err)
    } else {
        products = JSON.parse(data)
    }
})

app.get('/products', (req, res) => {
    return res.json(products)
})

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const product = {
        id: randomUUID(),
        name,
        price
    }
    products.push(product)
    addORUpdateProduct()
    res.json(product)
})

app.put('/products/:id', (req, res) => {
    const { id } = req.params
    const { name, price } = req.body
    const productIndex = products.findIndex((product) => product.id === id)

    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }
    addORUpdateProduct()
    return res.json({ message: "Product changed"})
})

app.delete('/products/:id', (req, res) => {
    const { id } = req.params
    const productIndex = products.findIndex(product => product.id === id)
    products.splice(productIndex, 1)
    return res.json({ message: "Product deleted"})
})

app.listen(3333, console.log("Servir listing http://localhost:3333"))