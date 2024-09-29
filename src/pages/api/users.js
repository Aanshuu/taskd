// pages/api/users.js
// import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Connect to the database
      const client = await clientPromise;
      const db = client.db();

      // Check if user already exists
      const existingUser = await db.collection('Users').findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await db.collection('Users').insertOne({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: 'User created successfully', userId: newUser.insertedId });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
