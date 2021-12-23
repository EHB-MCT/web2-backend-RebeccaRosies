const { MongoClient, ObjectId } = require('mongodb');
const cors = require ("cors");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
console.log(process.env.PORT)

// extra variable & info fr mongodb to work
const client = new MongoClient(process.env.FINAL_URL);

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

app.get('/songs/:id', async (req, res) => {
  //get data from mongo en send naar res
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
      const col = db.collection("songs");  // Use the collection "challenges"

      const query = { _id: ObjectId(req.params.id) };
     
      const myDoc = await col.findOne(query);  // Find document & convert it to an array
      console.log(myDoc);   // Print to the console
      res.status(200).send(myDoc); //Send back the data with the response
  } catch (err) {
      console.log('error');
      res.status(500).send({
          error: "No documents matched the query. got 0 documents.",
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
          artist: req.body.artist,
          genre: req.body.genre,
          rating: req.body.rating
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

app.delete('/songs/:id', async (req, res) => {
  if (!req.params.id || req.params.id.length != 24 ) {
      res.status(400).send('bad result, missing id or id is not 24 chars long');
      return;
  }
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const col = db.collection("songs");  // Use the collection "challenges"
   
      // Create a query for a challenge to delete
      const query = { _id: ObjectId(req.params.id) };
      const message = { deleted: "Song deleted"}

      // Deleting the challenge
          const result = await col.deleteOne(query);
      if (result.deletedCount === 1 ) {
      res
          .status(200)
          .send(message);
      } else {
      res
          .status(404)
          .send("No documents matched the query. Deleted 0 documents.");
      }
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

app.delete('/songs', async (req, res) => {
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const col = db.collection("songs");  // Use the collection "challenges"
   
      // Create a query for a challenge to delete
      const message = { deleted: "All songs deleted"}

      // Deleting the challenge
          const result = await col.deleteMany();
      if (result.deletedCount >= 1 ) {
      res
          .status(200)
          .send(message);
      } else {
      res
          .status(404)
          .send("No documents matched the query. Deleted 0 documents.");
      }
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

app.put("/songs/:id", async (req, res) => {
  // check for body data
  const error = {error: "Bad request",
                 value: "Missing name, artist, genre or rating"}

  if ( !req.body.name || !req.body.artist || !req.body.genre ||!req.body.rating) {
    res.status(400).send(error);
    return;
  }
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const col = db.collection("songs");  // Use the collection "challenges"

    // Create a query for a challenge to update
    const query = { _id: ObjectId(req.params.id) };
    const message = { deleted: "Challenge updated"}

    // update a challenge
    const updateSong = {
        name: req.body.name,
        artist: req.body.artist,
        genre: req.body.genre,
        rating: req.body.rating,
    };
    console.log(query, updateSong);
    // Updating the challenge
    const result = await col.updateOne(query, {$set: updateSong});

    // Send back success message
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error,
    });
  } finally {
    await client.close();
  }
});

app.get('/songs/favorites', async (req, res) => {
  //get data from mongo en send naar res
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(dbName);
     
      const col = db.collection("favSongs");  // Use the collection "challenges"
   
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

app.post('/songs/favorites', async (req, res) => {
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
      const col = db.collection("favSongs");  // Use the collection "challenges"

      //save new song
      let newSong = {
          name: req.body.name,
          artist: req.body.artist,
          genre: req.body.genre,
          rating: req.body.rating
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

app.put("/songs/favorites/:id", async (req, res) => {
  // check for body data
  const error = {error: "Bad request",
                 value: "Missing name, artist, genre or rating"}

  if ( !req.body.name || !req.body.artist || !req.body.genre ||!req.body.rating) {
    res.status(400).send(error);
    return;
  }
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const col = db.collection("favSongs");  // Use the collection "challenges"

    // Create a query for a challenge to update
    const query = { _id: ObjectId(req.params.id) };
    const message = { deleted: "Song updated"}

    // update a challenge
    const updateSong = {
        name: req.body.name,
        artist: req.body.artist,
        genre: req.body.genre,
        rating: req.body.rating,
    };
    console.log(query, updateSong);
    // Updating the challenge
    const result = await col.updateOne(query, {$set: updateSong});

    // Send back success message
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error,
    });
  } finally {
    await client.close();
  }
});

app.delete('/songs/favorites/:id', async (req, res) => {
  if (!req.params.id || req.params.id.length != 24 ) {
      res.status(400).send('bad result, missing id or id is not 24 chars long');
      return;
  }
  try {
      //read the file
      //connect to the database
      await client.connect();
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const col = db.collection("favSongs");  // Use the collection "challenges"
   
      // Create a query for a challenge to delete
      const query = { _id: ObjectId(req.params.id) };
      const message = { deleted: "Song deleted"}

      // Deleting the challenge
          const result = await col.deleteOne(query);
      if (result.deletedCount === 1 ) {
      res
          .status(200)
          .send(message);
      } else {
      res
          .status(404)
          .send("No documents matched the query. Deleted 0 documents.");
      }
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