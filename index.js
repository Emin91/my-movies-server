const express = require('express');
require('dotenv').config()
const app = express();

const port = process.env.PORT;

app.get('/', async (req, res) => {
    res.send('JSON.stringify(arr)');
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});