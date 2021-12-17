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

app.get("/",(req,res)=>{
  res.send("Everything is ok!");
})

app.get('/songs', async (req, res) => {
  //get data from mongo en send naar res
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
     
      const col = db.collection("songs");  // Use the collection "challenges"
   
      const myDoc = await col.find({}).toArray();  // Find document & convert it to an array
      console.log(myDoc);   // Print to the console
      res.status(200).send(myDoc); //Send back the data with the response
  } catch (err) {
      console.log('error');
      res.status(500).send({
          error: 'an error has occured',
          value: error
      });
  } finally {
      await client.close();
  }
})

app.post('/songs', async (req, res) => {
  //can only send data in the body 
  /* console.log(req.body);
  res.send('ok'); */

  if (!req.body.name || !req.body.artist || !req.body.genre || !req.body.rating) {
      res.status(400).send('bad result, missing name, artist, genre or rating');
      return;
  }

  try {
      //connect with database
      await client.connect();
      console.log("Connected correctly to server");
      // retrieve the collection data
      const db = client.db(dbName);
      const col = db.collection("songs");  // Use the collection "challenges"

      //save new song
      let newSong = {
          name: req.body.name,
          points: req.body.artist,
          course: req.body.genre,
          session: req.body.rating
      }
      
      //insert into database
      let insertResult = await col.insertOne(newSong);

      //send back succes message

      res.status(201).json(newSong);
      console.log(newSong)
      return;

  } catch (error) {
      console.log('error');
      res.status(500).send({
          error: 'an error has occured',
          value: error
      });
  }finally{
      await client.close();
  }
});
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
  client.connect(err =>{
    if (err){
      throw err;
    }
    db = client.db(dbName)
    console.log(`connected to database ${dbName}`);
  });
})