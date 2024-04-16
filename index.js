require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
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




// var persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]


//get all people
app.get('/api/person',(req,res)=>{
    //res.json(persons)
    Person.find({}).then(person=>{
      res.json(person)
    })
    console.log('persons',persons)
})

//get one person
app.get('/api/person/:id',(req,res)=>{
  const id = req.params.id
  console.log(typeof(id))
  Person.findById(id)
    .then(person=>{
      console.log('Result:',person)
      res.json(person)
    })
    .catch(error=>{
      res.status(404).send({message:"Person doesn't exist"})
    })
  
})

//add person
app.post('/api/person',(req,res)=>{
  const reqPayload = req.body

  if(!reqPayload)
  {
    return res.status(404).json({
      error:'Content missing!'
    })
  }

  // const existingPerson = persons.find(person=>{
  //   return(
  //     person.name === reqPayload.name
  //     ) })
  


  // if(existingPerson)
  // {
    
  //   return res.status(400).json({ error: 'name must be unique' })
  // }

  console.log(reqPayload.number)
  if(reqPayload.number === undefined || reqPayload.name === undefined)
  {
    return res.status(400).json({ error: 'name or number must be provided' })

  }
  
  const person = new Person({
    name:reqPayload.name,
    number:reqPayload.number
  })
  console.log('new person:',person)

  // persons = persons.concat(person)
  // console.log('new list:',persons)

  person.save().then(savedPerson=>{
    console.log(`${savedPerson.name} saved!`)
    res.json(savedPerson)
  })

})

//delete person
app.delete('/api/person/:id',(req,res)=>{
  const id = req.params.id
  // const lengthBefore = persons.length
  // console.log("before:",persons,'length:',lengthBefore)
  // persons = persons.filter(person => person.id != id)
  // const lengthAfter = persons.length
  // console.log("after:",persons,'length:',lengthAfter)
  // if(lengthAfter!=lengthBefore)
  // {
  //   res.statusMessage = `Person with id:${id} has been deleted`
  //   res.status(204).end()
  // }
  // else
  // {
  //   res.statusMessage = 'Id not found!'
  //   res.status(204).end()
  // }
  Person.findByIdAndDelete(id).then(person=>{
    console.log(person,"is removed from DB")
    res.json(person)
  })
  .catch(error=>{
    console.log("Error:",error)
    res.status(404).send({message:"Deletion failed"})
  })
  
})


//get info
app.get('/api/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people <br/> <br/> ${new Date()}</p>`)
})


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

