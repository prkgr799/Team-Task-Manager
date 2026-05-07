const express = require('express');
const db = require('../db');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      // Find tasks assigned to this user to get project IDs
      const userTasks = await db.tasks.find({ assignedTo: req.user._id });
      const assignedProjectIds = [...new Set(userTasks.map(t => t.project))];
      
      // Query projects where user is a member OR has an assigned task
      query = { 
        $or: [
          { members: req.user._id }, 
          { _id: { $in: assignedProjectIds } }
        ] 
      };
    } else {
      query = { owner: req.user._id };
    }
    
    const projects = await db.projects.find(query);
    res.send(projects);
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).send(error);
  }
});

router.post('/', auth, authorize(['Admin']), async (req, res) => {
  try {
    const project = await db.projects.insert({
      ...req.body,
      owner: req.user._id,
      status: 'Active',
      createdAt: new Date(),
      members: req.body.members || []
    });
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await db.projects.findOne({ _id: req.params.id });
    if (!project) return res.status(404).send();
    res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
