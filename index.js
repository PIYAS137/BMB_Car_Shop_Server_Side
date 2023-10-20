const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5020;
require('dotenv').config()


// middleWare ---
app.use(cors())
app.use(express.json())


console.log(process.env.DB_USERNAME);

// -----------------------------------------------------------------mongoDB---------------------------------------------------//

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_SECRET_KEY}@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority`;

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
    const carsCollection = client.db('brandDB').collection('carsCollection');
    const cartCollection = client.db('brandDB').collection('cartCollection');



    // get all category data
    app.get('/category',async(req,res)=>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // get all product data 
    app.get('/all',async(req,res)=>{
      const cursor = carsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // find one brand data 
    app.get('/:brandName',async(req,res)=>{
      const brandName = req.params.brandName;
      const cursor = categoryCollection.find({brand:brandName})
      const result = await cursor.toArray()
      res.send(result);
    })
    // add cars for database
    app.post('/addcars',async(req,res)=>{
      const data = req.body;
      const result = await carsCollection.insertOne(data)
      res.send(result)
    })
    // get category wise cars form database 
    app.get('/category/:brand',async(req,res)=>{
      const brandName = req.params.brand;
      const cursor = carsCollection.find({company:brandName})
      const result = await cursor.toArray()
      res.send(result)
    })
    // get all cars from database
    app.get('/getCars',async(req,res)=>{
      const cursor = carsCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    // get one car details 
    app.get('/getcar/:sid',async(req,res)=>{
        const id = req.params.sid;
        const query = {_id: new ObjectId(id)}
        const result = await carsCollection.findOne(query)
        res.send(result)
    })

    // update one car data 
    app.put('/:sid',async(req,res)=>{
      const id = req.params.sid;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert:true}
      const updatedData = req.body;
      const updatedDocument ={
        $set:{
          modelName:updatedData.modelName,
          img:updatedData.img,
          price:updatedData.price,
          rating:updatedData.rating,
          description:updatedData.description,
          milage:updatedData.milage,
          fuelType:updatedData.fuelType,
          company:updatedData.company,
          fuelTankCapacity:updatedData.fuelTankCapacity,
          seatingCapacity:updatedData.seatingCapacity,
          release:updatedData.release,
          speed:updatedData.speed,
          cylinder:updatedData.cylinder,
          torque:updatedData.torque,
          hp:updatedData.hp
        }
      }
      const result = await carsCollection.updateOne(filter,updatedDocument,options)
      res.send(result)
    })
    // delete card product from database 
    app.delete('/del/:sid',async(req,res)=>{
      const id = req.params.sid;
      const query = {_id : new ObjectId(id)};
      const result = await carsCollection.deleteOne(query)
      res.send(result)
    })
    // post operation for cart 
    app.post('/cart/post',async(req,res)=>{
      const data = req.body;
      const result = await cartCollection.insertOne(data)
      res.send(result); 
    })
    // get operation for cart
    app.get('/cart/get',async(req,res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // delete operation for cart 
    app.delete('/cart/:sid',async(req,res)=>{
      const id = req.params.sid;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })



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
    res.send("BMB Automotive server is coming soon...");
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})