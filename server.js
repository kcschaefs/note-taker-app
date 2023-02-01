const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('express');
const db = "./db/db.json";
const PORT = process.env.PORT || 3001;

const app = express();

function generateId() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
  console.info(`GET /api/notes`);
  const fileContents = fs.readFileSync(db);
  res.status(200).send(fileContents);
});

// POST request for notes
app.post('/api/notes', (req, res) => {
  console.info(`Post /api/notes`);
  const fileContents = fs.readFileSync(db);
  const json = JSON.parse(fileContents);
  const newItem = req.body;
  newItem.id = generateId();
  json.push(newItem);
  fs.writeFileSync(db, JSON.stringify(json));
  res.status(201).json(json);
});

// DELETE request for notes
app.delete('/api/notes/:id', (req, res) => {
  const fileContents = fs.readFileSync(db);
  const json = JSON.parse(fileContents);
  const id = req.params.id;
  const newjson = json.filter(note => note.id != id)
  fs.writeFileSync(db, JSON.stringify(newjson));
  res.status(200).json(newjson);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
