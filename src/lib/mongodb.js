import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Add your MongoDB URI in .env.local
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Add MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the MongoClient is not constantly recreated.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
