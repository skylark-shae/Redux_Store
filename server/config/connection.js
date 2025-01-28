import mongoose from 'mongoose';
import dotenv from 'dotenv';


mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sklylark:SkKl0666@googlebooks.btssk.mongodb.net/ReduxStore?retryWrites=true&w=majority&appName=Redux');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/redux-store', {
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

export default mongoose.connection;

// ORIGINAL CODE
// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sklylark:SkKl0666@googlebooks.btssk.mongodb.net/ReduxStore?retryWrites=true&w=majority&appName=Redux');

// module.exports = mongoose.connection;
