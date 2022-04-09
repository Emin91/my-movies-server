const express = require('express');
require('dotenv').config();
const app = express();

let port = process.env.PORT
app.get('/', (req, res) => {
    res.end('<h1>Hello</h1>')
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});