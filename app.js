const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

const dbConfig = {
  host: '127.0.0.1',
  user: 'admin',
  password: 'Pass321@',
  database: 'sticky_notes_db',
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) throw err;
  console.log('connected to the database!');
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM notes';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database Error');
      return;
    }
    res.render('index', {notes: results});
  });
});

app.put('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const noteContent = req.body.content;

  const sql = 'UPDATE notes SET content = ? WHERE id = ?';
  db.query(sql, [noteContent, noteId], (err, results) => {
    if (err) {
      res.status(500).send('Database Error');
      return;
    }
    res.status(200).json({message: 'Success'});
  });
});

app.post('/api/notes', (req, res) => {
  const noteContent = req.body.content || 'New Note';

  const sql = 'INSERT INTO notes (content) VALUES (?)';

  db.query(sql, [noteContent], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database Error');
      return;
    }
    const newId = results.insertId;
    res.status(201).json({id: newId, content: noteContent});
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteid = req.params.id;

  const sql = 'DELETE FROM notes WHERE id = ?';

  db.query(sql, [noteid], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database Error');
      return;
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
