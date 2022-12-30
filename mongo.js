const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password> OR node mongo.js <password> <name> <phone>'
  );
  process.exit(1);
}

// Get initial data
const atlasPassword = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

console.log(atlasPassword, newName, newNumber);

const mongoUri = `mongodb+srv://fullstackopen:${atlasPassword}@phonebook.vpiohgj.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUri)
  .then((result) => {
    console.log('MongoDB cluster connected successfully');
    return;
  })
  .catch((error) => console.log(error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (newName && newNumber) {
  const newPerson = new Person({ name: newName, number: newNumber });

  console.log(newPerson);
  newPerson
    .save()
    .then(() => {
      console.log(`Added ${newName}, number ${newNumber} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((error) => console.log(error));
} else if (atlasPassword && newName === undefined && newNumber === undefined) {
  console.log('2');
  Person.find({})
    .then((response) => {
      console.log('phonebook:');
      response.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      return mongoose.connection.close();
    })
    .catch((error) => console.log(error));
}
