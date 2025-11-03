const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://smartDbUser:U27pDlUoMBT21gGM@mypanel.2nu9rfb.mongodb.net/?appName=MyPanel";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) =>{
    res.send('Smart server is running')
})

async function run() {
  try {
    await client.connect();

    const db = client.db('smart_db');
    const productsCollection = db.collection('products');
    const bidsCollection =db.collection('bids')
    //Get
    app.get('/products', async (req, res) =>{
        console.log(req.query)
        const email = req.query.email;
        const query ={}
        if(email){
            query.email = email;

        }

        const cursor = productsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    //Find
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.findOne(query);
        res.send(result);
    })
    
    //Post
    app.post('/products', async (req, res) =>{
        const newProduct = req.body
        const result = await productsCollection.insertOne(newProduct)
        res.send(result);
    })
    //Patch
    app.patch('/products/:id', async (req, res) =>{
        const id = req.params.id;
        const updatedProduct = req.body;
        const query = {_id: new ObjectId(id)}
        const update = {
            $set: {
                name: updatedProduct.name,
                price: updatedProduct.price,
            }
        }

        const result = await productsCollection.updateOne(query, update);
        res.send(result)
    })
    //Delete
    app.delete('/products/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.deleteOne(query);
        res.send(result)
    })
    //Bids related api
    app.get('/bids', async(req, res) =>{
        const email = req.query.email;
        const query = {};
        if(email){
            query.buyer_email = email;
        }

        const cursor = bidsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () =>{
    console.log(`Smart server is running on port: ${port}`)
})