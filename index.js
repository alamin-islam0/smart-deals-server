const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mypanel.2nu9rfb.mongodb.net/?appName=MyPanel`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db");
    const productsCollection = db.collection("products");
    const bidsCollection = db.collection("bids");
    const usersCollection = db.collection("users");
    //Users Api
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send({ Message: "User already exists" });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });
    // Products Api
    //Get
    app.get("/products", async (req, res) => {
      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //Latest Products
    app.get("/latest-products", async (req, res) => {
      const cursor = productsCollection
        .find()
        .sort({ created_at: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    //Find
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //Post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });
    //Patch
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };

      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    });
    //Delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    //Bids related api
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //Products Bids with Product Info:
    app.get("/products/bids/:ProductId", async (req, res) => {
      const ProductId = req.params.ProductId;

      try {
        const bidsWithProduct = await bidsCollection
          .aggregate([
            { $match: { product: ProductId } },
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product_info",
              },
            },
            { $unwind: "$product_info" },
            { $sort: { bid_price: -1 } },
          ])
          .toArray();

        res.send(bidsWithProduct);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
      }
    });
    //My Bids:
    // GET /bids?email=someone@example.com
    app.get("/bids", async (req, res) => {
      try {
        const { email } = req.query; // read from querystring
        const query = email ? { buyer_email: email } : {};
        const result = await bidsCollection.find(query).toArray();
        return res.json(result); // ensure JSON
      } catch (err) {
        console.error("GET /bids failed:", err);
        return res.status(500).json({ message: "Failed to fetch bids" });
      }
    });
    //Bids Get
    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });
    //Bids Delete
    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(query);
      res.send(result);
    });
    //Find Bids
    app.get("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`);
});
