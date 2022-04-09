const express = require('express');
require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const { v4: uuid } = require('uuid');

const port = process.env.PORT || 80
const arr = [];
const movieInfo = {}

var resolvedFlag = true;
async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}

let mypromise = function functionOne(testInput) {
    console.log("Entered function");
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                console.log("Inside the promise");
                if (resolvedFlag == true) {
                    resolve("Resolved");
                } else {
                    reject("Rejected")
                }
            }, 6000
        );
    });
};

app.get('/', async (req, res) => {
    try {
        const answer = await mypromise();
        res.send(answer);
    }
    catch (error) {
        return next(error);
    }
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});