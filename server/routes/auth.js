const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Manual hashing since we're not using Mongoose middleware
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await db.users.insert({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'Member',
      createdAt: new Date()
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send({ user: userWithoutPassword, token });
  } catch (error) {
    if (error.errorType === 'uniqueViolated') {
      return res.status(400).send({ error: 'Email already exists' });
    }
    res.status(400).send({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
    const { password: _, ...userWithoutPassword } = user;
    res.send({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
