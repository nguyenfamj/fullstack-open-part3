const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/db/dbConnection');
const { Person } = require('./config/db/model/Person');

connectDB().then(() => {
  // Port
  const SERVER_PORT = process.env.PORT || '3001';

  app.listen(SERVER_PORT, () => {
    console.log(`Server running on PORT ${SERVER_PORT}`);
  });

  app.use(cors());
  app.use(express.static('build'));
  app.use(express.json());

  // Setup morgan logger
  morgan.token('requestBody', (req, res) => JSON.stringify(req.body));
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'));

  // /api/persons
  app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
      return response.status(200).json(persons);
    });
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Person.findById(id).then((foundPerson) => {
      if (!foundPerson) {
        return response.status(404).json({ message: `Person with id ${id} not found` });
      }
      return response.status(200).json(foundPerson);
    });
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

    console.log(name, number);

    if (!name || !number) {
      return response.status(400).send('Name or number not included in the request');
    }

    const newPerson = new Person({ name, number });

    newPerson.save().then((savedPerson) => {
      return response.status(200).json(savedPerson);
    });
  });

  // Info endpoint
  app.get('/info', (request, response) => {
    const html = `<div><div>Phonebook has info for ${
      persons.length
    }</div><div>${new Date()}</div></div>`;
    return response.status(200).send(html);
  });
});
