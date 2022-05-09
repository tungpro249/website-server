const mongoose = require('mongoose');

async function connect(){
  try {
      await mongoose.connect('mongodb://localhost:27017/do_an');
      console.log('connect database sucsess')
  } catch (error) {
    console('connect database fallure')
  }
}

module.exports = { connect }
