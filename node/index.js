const express = require('express');
const moment = require('moment');

const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const accountRoute = require('./routes/account');


const app = express();

// some middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/account', accountRoute);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);

app.get('/api/', (request, response) => {
  response.send("You are at /api/ ffs");
});

app.listen(3000, () => {
  console.log("Node server is running...");
});
