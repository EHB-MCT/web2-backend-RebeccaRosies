const { MongoClient } = require('mongodb');
const cors = require ("cors");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// extra variable & info fr mongodb to work
const uri = "mongodb+srv://admin:admin@cluster0.dzxmp.mongodb.net/persic?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = "persic";

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors());

app.get("/songs",(req,res)=>{
  res.send("hello world!");
})

/* async function run() {
  try {
       await client.connect();
       console.log("Connected correctly to server");
       const db = client.db(dbName);
       // Use the collection "people"
       const col = db.collection("songs");
       // Construct a document                                                                                                                                                              
       let songDocument = {
           "name":"Animals",
           "artist": "THE HARA",                                                                                                                                 
           "genre":"ALT",                                                                                                                                 
           "rating":8
       }
       // Insert a single document, wait for promise so we can read it back
       //const p = await col.insertOne(songDocument);
       // Find one document
       const myDoc = await col.findOne();
       // Print to the console
       console.log(myDoc);
       
      } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();
   }
}
run().catch(console.dir); */

// create server with 'port' as fisrt variable & callback function as the second variable
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
})