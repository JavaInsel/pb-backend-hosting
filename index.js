require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const cors = require('cors');

const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

/* eslint-disable-next-line consistent-return */
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
    /* eslint-disable-next-line no-else-return */
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/* eslint-disable no-alert, prefer-arrow-callback */
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms', JSON.stringify(req.body)// eslint-disable-line comma-dangle
  ].join(' ');
}));

// get all people
app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

// get one person
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id; // eslint-disable-line prefer-destructuring
  Person.findById(id)
    .then((person) => {
      console.log('Result:', person);
      if (person) {
        res.json(person);
      } else {
        res.status(404).send('Id does not exist!');
      }
    })
    .catch((error) => next(error));
});

// add person
app.post('/api/persons', (req, res, next) => { // eslint-disable-line consistent-return
  const reqPayload = req.body;

  if (!reqPayload) {
    return res.status(404).json({
      error: 'Content missing!' // eslint-disable-line comma-dangle
    });
  }

  console.log(reqPayload.number);
  if (reqPayload.number === undefined || reqPayload.name === undefined) {
    return res.status(400).json({ error: 'name or number must be provided' });
  }

  const person = new Person({
    name: reqPayload.name,
    number: reqPayload.number // eslint-disable-line comma-dangle
  });
  console.log('new person:', person);

  // persons = persons.concat(person)
  // console.log('new list:',persons)

  person.save()
    .then((savedPerson) => {
      console.log(`${savedPerson.name} saved!`);
      res.json(savedPerson);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// update person
app.put('/api/persons/:id', (req, res, next) => { // eslint-disable-line consistent-return
  const reqPayload = req.body;
  const id = req.params.id; // eslint-disable-line prefer-destructuring
  console.log('Person id:', id);
  if (!reqPayload) {
    return res.status(404).json({
      error: 'Content missing!' // eslint-disable-line comma-dangle
    });
  }

  console.log(reqPayload.number);
  if (reqPayload.number === undefined || reqPayload.name === undefined) {
    return res.status(400).json({ error: 'name or number must be provided' });
  }

  const person = {
    name: reqPayload.name,
    number: reqPayload.number // eslint-disable-line comma-dangle
  };
  console.log('new person:', person);

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id; // eslint-disable-line prefer-destructuring

  Person.findByIdAndDelete(id)
    .then((person) => {
      console.log(person, 'is removed from DB');
      res.json(person);
    })
    .catch((error) => {
      console.log('Error:', error);
      res.status(404).send({ message: 'Deletion failed' });
    });
});

// get info
app.get('/api/info', (req, res) => {
  Person.countDocuments({})
    .then((count) => res.send(`<p>Phonebook has info for ${count} people <br/> <br/> ${new Date()}</p>`));
});

app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
