const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5020;


// middleWare ---
app.use(cors())
app.use(express.json())


// bIOh4nL17wu2jm7g
// automotivebrandwebsite

// -----------------------------------------------------------------mongoDB---------------------------------------------------//

const uri = "mongodb+srv://automotivebrandwebsite:bIOh4nL17wu2jm7g@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryCollection = client.db('brandDB').collection('categoryCollection');


    app.post('/category',async(req,res)=>{
      const data = req.body;
      const result = await categoryCollection.insertOne(data);
      res.send(result)
    })

    app.get('/category',async(req,res)=>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // find one brand data 
    app.get('/:brandName',async(req,res)=>{
      const brandName = req.params.brandName;
      const cursor = categoryCollection.find({brand:brandName})
      const result = await cursor.toArray()
      res.send(result);
    })

    // get data by brand name
    // app.get('/:brand',async(req,res)=>{
    //   const brand = req.params.brand;

    //   const cursor = allcarsCollection.find({brand:brand})
    //   const result = await cursor.toArray()
    //   res.send(result);
    // })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// -----------------------------------------------------------------mongoDB---------------------------------------------------//


app.get('/',(req,res)=>{
    res.send("Server is coming soon");
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})