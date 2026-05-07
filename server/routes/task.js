const express = require('express');
const db = require('../db');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await db.tasks.find({ project: req.params.projectId });
    // Manually join with user names for display
    const enrichedTasks = await Promise.all(tasks.map(async (task) => {
      const user = await db.users.findOne({ _id: task.assignedTo }, { name: 1, email: 1 });
      return { ...task, assignedTo: user };
    }));
    res.send(enrichedTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', auth, authorize(['Admin']), async (req, res) => {
  try {
    const task = await db.tasks.insert({
      ...req.body,
      status: 'Todo',
      createdAt: new Date()
    });
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await db.tasks.findOne({ _id: req.params.id });
    if (!task) return res.status(404).send();

    if (req.user.role !== 'Admin' && task.assignedTo !== req.user._id) {
      return res.status(403).send({ error: 'Not authorized' });
    }

    const updatedTask = await db.tasks.update(
      { _id: req.params.id },
      { $set: req.body },
      { returnUpdatedDocs: true }
    );
    res.send(updatedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/stats/summary', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      query = { assignedTo: req.user._id };
    }

    const tasks = await db.tasks.find(query);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < new Date()).length;

    res.send({ totalTasks, completedTasks, inProgressTasks, todoTasks, overdueTasks });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
