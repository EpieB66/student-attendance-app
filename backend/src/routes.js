const express = require('express');
const router = express.Router();
const db = require('./db');


// === STUDENT ROUTES ===

// Get all students
router.get('/students', (req, res) => {
  db.query('SELECT * FROM students ORDER BY matriculation', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add new student
router.post('/students', (req, res) => {
  const { matriculation, name, present = false } = req.body;
  
  if (!matriculation || !name) {
    return res.status(400).json({ 
      error: "Matriculation and Name are required" 
    });
  }

  db.query(
    'INSERT INTO students (matriculation, name, present) VALUES (?, ?, ?)',
    [matriculation.trim(), name.trim(), present],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        id: result.insertId, 
        matriculation: matriculation.trim(), 
        name: name.trim(), 
        present 
      });
    }
  );
});

// Toggle presence
router.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { present } = req.body;
  
  db.query(
    'UPDATE students SET present = ? WHERE id = ?',
    [present, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated' });
    }
  );
});

// Delete student
router.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;