const express = require('express');
require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const { v4: uuid } = require('uuid');
const axios = require('axios');


const port = process.env.PORT || 80
const arr = [];
const movieInfo = {}

var resolvedFlag = true;
async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}
async function getUser() {
    try {
        const html = await axios.get('https://www.ivi.az/collections/best-movies');
        const $ = cheerio.load(html);
        $('.gallery__item.gallery__item_virtual').each((i, el) => {
            const title = $(el).find('.nbl-slimPosterBlock__title').text() || null;
            const imgLink = $(el).find('img').attr('src') || null;
            const movieId = $(el).find('a').attr('href').match(/\d+/g).toString() || null;
            const ageLimit = $(el).find('.nbl-poster__nbl-ageBadge').attr('class').match(/\d+/g).toString() || null;
            arr.push({ id: uuid(), title, imgLink, movieId, ageLimit });
        })
    } catch (error) {
        console.error(error);
    }
}


let mypromise = function functionOne(testInput) {

    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                if (resolvedFlag == true) {
                    resolve(JSON.stringify(arr));
                } else {
                    reject("Rejected")
                }
            }, 6000
        );
    });
};

app.get('/', async (req, res) => {
    const html = await axios.get('https://www.ivi.az/collections/best-movies');
    const $ = cheerio.load(html);
    $('.gallery__item.gallery__item_virtual').each((i, el) => {
        const title = $(el).find('.nbl-slimPosterBlock__title').text() || null;
        const imgLink = $(el).find('img').attr('src') || null;
        const movieId = $(el).find('a').attr('href').match(/\d+/g).toString() || null;
        const ageLimit = $(el).find('.nbl-poster__nbl-ageBadge').attr('class').match(/\d+/g).toString() || null;
        arr.push({ id: uuid(), title, imgLink, movieId, ageLimit });
    })
    res.json({data: JSON.stringify(arr)})
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});