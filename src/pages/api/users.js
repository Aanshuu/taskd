import clientPromise from '../../lib/mongodb';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('taskd');
  const usersCollection = db.collection('Users');

  switch (req.method) {
    // Register a new user (POST)
    case 'POST':
      try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await hash(password, 12);
        const newUser = {
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Insert the new user into the Users collection
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
      }
      break;

    // Handle other methods, e.g., GET, DELETE if needed
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
