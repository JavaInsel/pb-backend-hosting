
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms', JSON.stringify(req.body)

  ].join(' ')
}))




//helper function
const generateId = ()=>{
  return Math.floor(Math.random()*1000000)
}


var persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//get all persons
app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

//get one person
app.get('/api/persons/:id',(req,res)=>{
  const id = Number(req.params.id)
  const person = persons.find(person=>person.id === id)
  if(person)
  {
    res.json(person)
  }
  else
  {
    res.status(204).end()
  }
  
})

//add person
app.post('/api/persons',(req,res)=>{
  const reqPayload = req.body

  if(!reqPayload)
  {
    return res.status(404).json({
      error:'Content missing!'
    })
  }

  const existingPerson = persons.find(person=>{
    return(
      person.name === reqPayload.name
      ) })
  


  if(existingPerson)
  {
    
    return res.status(400).json({ error: 'name must be unique' })
  }

  console.log(reqPayload.number)
  if(reqPayload.number === undefined || reqPayload.name === undefined)
  {
    return res.status(400).json({ error: 'name or number must be provided' })

  }
  
  const person = {
    id:generateId(),
    name:reqPayload.name,
    number:reqPayload.number
  }
  console.log('new person:',person)

  persons = persons.concat(person)
  console.log('new list:',persons)

  res.json(persons)

})

//delete person
app.delete('/api/persons/:id',(req,res)=>{
  const id = Number(req.params.id)
  const lengthBefore = persons.length
  console.log("before:",persons,'length:',lengthBefore)
  persons = persons.filter(person => person.id != id)
  const lengthAfter = persons.length
  console.log("after:",persons,'length:',lengthAfter)
  if(lengthAfter!=lengthBefore)
  {
    res.statusMessage = `Person with id:${id} has been deleted`
    res.status(204).end()
  }
  else
  {
    res.statusMessage = 'Id not found!'
    res.status(204).end()
  }
  
})


//get info
app.get('/api/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people <br/> <br/> ${new Date()}</p>`)
})


app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

