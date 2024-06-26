const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument'); // eslint-disable-line indent
    process.exit(1); // eslint-disable-line indent
}

const password = process.argv[2];
console.log('pass', password);

// eslint-disable-next-line operator-linebreak
const url =
    `mongodb+srv://aveirohansen101:${password}@fullstack.aksmlmp.mongodb.net/person?retryWrites=true&w=majority&appName=fullstack`;

mongoose.set('strictQuery', false);

mongoose.connect(url);
/* eslint-disable */
const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Phonenumber = mongoose.model('Phonenumber', phonebookSchema);

if (process.argv.length > 3) {
    const phoneNumber = new Phonenumber({
        name: process.argv[3],
        number: process.argv[4]
    });

    phoneNumber.save().then((result) => {
        console.log(result);
        console.log(`added ${phoneNumber.name} number ${phoneNumber.number} to phonebook`);
        mongoose.connection.close();
    })
}

Phonenumber.find({}).then((result) => {
    result.forEach((record) => {
        console.log(record);
    });
    mongoose.connection.close();
});
/* eslint-enable */
