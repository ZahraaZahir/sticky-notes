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

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
