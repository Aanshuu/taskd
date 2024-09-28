import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('taskd');
  const boardsCollection = db.collection('Boards');

  switch (req.method) {
    case 'POST':
      try {
        const { title, tasks } = req.body;
        const board = {
          title,
          tasks: tasks ? tasks.map(id => id) : [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await boardsCollection.insertOne(board);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create board' });
      }
      break;

    case 'GET':
      try {
        const boards = await boardsCollection.find({}).toArray();
        res.status(200).json(boards);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch boards' });
      }
      break;

    case 'PUT':
      try {
        const { id, updates } = req.body;
        const updatedBoard = {
          ...updates,
          updatedAt: new Date(),
        };
        const result = await boardsCollection.updateOne(
          { _id: id  },
          { $set: updatedBoard }
        );
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update board' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const result = await boardsCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete board' });
      }
      break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
