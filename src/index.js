const { MongoClient } = require('mongodb');
const cors = require ("cors");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337;

// extra variable & info fr mongodb to work
const uri = "mongodb+srv://admin:admin@cluster0.dzxmp.mongodb.net/persic?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("persic").collection("songs");
  // perform actions on the collection object
  client.close();
});

const dbName = "persic";

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors());

async function run() {
  try {
      await client.connect();
      console.log("Connected correctly to server");
  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}
run().catch(console.dir);