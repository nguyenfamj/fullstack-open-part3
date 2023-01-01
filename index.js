const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { connectDB } = require('./config/db/dbConnection')
const { Person } = require('./config/db/model/Person')
const { errorHandler } = require('./middleware/errorHandler')

connectDB().then(() => {
  // Port
  const SERVER_PORT = process.env.PORT || '3001'

  app.listen(SERVER_PORT, () => {
    console.log(`Server running on PORT ${SERVER_PORT}`)
  })

  app.use(cors())
  app.use(express.static('build'))
  app.use(express.json())

  // Setup morgan logger
  morgan.token('requestBody', (req) => JSON.stringify(req.body))
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'))

  // /api/persons
  app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
      return response.status(200).json(persons)
    })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
      .then((foundPerson) => {
        if (!foundPerson) {
          return response
            .status(404)
            .json({ message: `Person with id ${id} not found` })
            .end()
        }
        return response.status(200).json(foundPerson)
      })
      .catch((error) => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndRemove(id)
      .then((result) => {
        console.log(`User ${result._id} deleted successfully`)
        response.status(204).end()
      })
      .catch((error) => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    console.log(name, number)

    if (!name || !number) {
      return response.status(400).send('Name or number not included in the request')
    }

    const newPerson = new Person({ name, number })

    newPerson
      .save()
      .then((savedPerson) => {
        return response.status(200).json(savedPerson)
      })
      .catch((error) => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
      return response.status(400).send('Name or number not included in the request')
    }

    const updatedPerson = { name, number }

    Person.findByIdAndUpdate(request.params.id, updatedPerson, {
      new: true,
      runValidators: true,
      context: 'query',
    })
      .then((person) => response.status(200).json(person).end())
      .catch((error) => next(error))
  })

  // Info endpoint
  app.get('/info', (request, response) => {
    Person.find({}).then((persons) => {
      const html = `<div><div>Phonebook has info for ${
        persons.length
      }</div><div>${new Date()}</div></div>`
      return response.status(200).send(html)
    })
  })

  // Error Handler
  app.use(errorHandler)
})
