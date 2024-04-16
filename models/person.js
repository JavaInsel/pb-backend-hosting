const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

//Exercises 3.12
//Check if DB password given
// if (process.argv.length<3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]
// console.log('pass',password)

//connect to DB
console.log('connecting to', url)
mongoose.connect(url)
    .then(result=>{
        console.log('Connected to MongoDB')
    })
    .catch(error=>{
        console.log('Connection failed. Error: ',error.message)
    })

//Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.person_id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

//Model
const Person = mongoose.model('Person',personSchema)

//Exercise 3.12
//If password and new person given -> save the given person to DB
// if(process.argv.length>3){
//     const person = new Person({
//         name:process.argv[3],
//         number:process.argv[4]
//     })
    
//     person.save().then(result=>{
//         console.log(result)
//         console.log(`added ${person.name} number ${person.number} to phonebook`)
//         mongoose.connection.close()
//     })
// }

// //If only password give -> output all records
// Person.find({}).then(result=>{
//     result.forEach(record=>{
//             console.log(record)
//     })
//     mongoose.connection.close()
// })

//Export module
module.exports = Person