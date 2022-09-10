const express = require('express');
const moment = require('moment');

const userRoute = require('./routes/user');


const app = express();

// some middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRoute);

app.get('/api/', (request, response) => {
  response.send("You are at /api/ ffs");
});

console.log('nice tits...');

app.listen(3000, () => {
  console.log("Node server is running...");
});
