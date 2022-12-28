const express = require('express');
const app = express();
const morgan = require('morgan');

let persons = [
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

app.use(express.json());

// Setup morgan logger
morgan.token('requestBody', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'));

// /api/persons
app.get('/api/persons', (request, response) => {
  return response.status(200).json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const foundPerson = persons.find((person) => person.id === id);

  if (!foundPerson) {
    return response.status(404).send(`Person with id ${id} not found`);
  }

  return response.status(200).json(foundPerson);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const foundPerson = persons.find((person) => person.id === id);

  if (!foundPerson) {
    return response.status(404).send(`Person with id ${id} not found and cannot be deleted`);
  }

  persons = persons.filter((person) => person.id !== id);

  return response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).send('Name or number not included in the request');
  }

  if (persons.find((person) => person.name === name || person.number === number)) {
    return response.status(404).send('Name or number has already been added to the phonebook');
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000 + Math.max(...persons.map((person) => person.id))),
    name,
    number,
  };

  persons.push(newPerson);

  return response.status(200).json(newPerson);
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
