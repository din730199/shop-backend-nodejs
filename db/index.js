const mongoose = require('mongoose');
const config = require('config');
module.exports = () => {
  try {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
      config.get('URI'),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) throw console.log(err);
        console.log('Mongodb connected');
      }
    );
  } catch (error) {
    console.log(error);
  }
};
