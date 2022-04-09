const express = require('express');
const app = express();

const port = 80;

app.get('/', (req, res) => {
    res.end('<h1>Hello</h1>')
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});