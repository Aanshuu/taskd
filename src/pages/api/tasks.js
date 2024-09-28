import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('taskd');
  const tasksCollection = db.collection('Tasks');

  switch (req.method) {
    // Create a new task
    case 'POST':
      try {
        const { title, description, status, boardId, assignedTo } = req.body;
        const task = {
          title,
          description,
          status: status || 'Todo',
          boardId: boardId,
          assignedTo: assignedTo ? assignedTo.map(id => id) : [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await tasksCollection.insertOne(task);
        const newTask = await tasksCollection.findOne({ _id: result.insertedId });
        res.status(201).json(newTask);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
      }
      break;

    // Get all tasks
    case 'GET':
      try {
        const tasks = await tasksCollection.find({}).toArray();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      break;

    // Update a task
    case 'PUT':
      try {
        const { id, updates } = req.body;
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid task ID' });
        }

        const updatedTask = {
          ...updates,
          updatedAt: new Date(),
        };

        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },  // Correct usage of ObjectId
          { $set: updatedTask }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(task);  // Return the updated task
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
      }
      break;

    // Delete a task
    case 'DELETE':
      try {
        const { id } = req.body;
        
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid task ID' });
        }

        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
      }
      break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
