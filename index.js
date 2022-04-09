const express = require('express');
require('dotenv').config()
const app = express();

const port = process.env.PORT;

app.get('/', async (req, res) => {
    res.json({success: true, data: 'hello'})
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});