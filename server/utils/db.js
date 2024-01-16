import { MongoClient } from 'mongodb';

const connectionString = 'mongodb://localhost:27017';

const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

const db = client.db('practice-mongo');

export { client, db };
