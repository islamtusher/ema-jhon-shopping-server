const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7fx9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect()
        const productsCollection = client.db("emaJhonServices").collection('products')
        
        // Load all data
        app.get('/products', async (req, res) => {
            const currentPage = parseInt(req.query.currentPage)
            const productsOnPage = parseInt(req.query.productsOnPage)
            
            const query = {}
            const cursor = productsCollection.find(query)
            
            //rmv page: currentPage:0 skip (0*productsOnPage) limit (productsOnPage)
            //rmv page: currentPage:1 skip (1*productsOnPage) limit (productsOnPage)
            //rmv page: currentPage:2 skip (2*productsOnPage) limit (productsOnPage)
            
            let result;
            if (currentPage || productsOnPage) {
                 result = await cursor.skip(currentPage*productsOnPage).limit(productsOnPage).toArray()
                
            } else {
                 result = await cursor.toArray()
                
            }
            res.send(result)
        })

        // load data length
        app.get('/productsLength', async (req, res) => {
            const productsLength = await productsCollection.estimatedDocumentCount()
            res.send({productsLength})
        })
        app.listen(port, () => {
            console.log('Listing', port);
        })
    }
    finally {
        
    }
}
run().catch(console.dir)