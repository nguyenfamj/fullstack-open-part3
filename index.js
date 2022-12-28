const express = require('express');
const app = express();

app.use(express.json());

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// Define
app.get('/api/persons', (request, response) => {
  return response.status(200).json(persons);
});

// Info endpoint
app.get('/info', (request, response) => {
  const html = `<div><div>Phonebook has info for ${
    persons.length
  }</div><div>${new Date()}</div></div>`;
  return response.status(200).send(html);
});

// Port
const SERVER_PORT = 3001;

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on PORT ${SERVER_PORT}`);
});