const mongoose = require('mongoose');

async function connect(){
  try {
    mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/grandution_thesis', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, () =>
      console.log("connected"));
  } catch (error) {
    console.log("could not connect");
  }
}

module.exports = { connect }