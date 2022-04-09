const express = require('express');
require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const { v4: uuid } = require('uuid');

const port = process.env.PORT || 80
const arr = [];
const movieInfo = {}


async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}



app.get('/', async (req, res) => {
    request('https://www.ivi.az/collections/best-movies', async (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            // Get best movies list
            $('.gallery__item.gallery__item_virtual').each((i, el) => {
                const title = $(el).find('.nbl-slimPosterBlock__title').text() || null;
                const imgLink = $(el).find('img').attr('src') || null;
                const movieId = $(el).find('a').attr('href').match(/\d+/g).toString() || null;
                const ageLimit = $(el).find('.nbl-poster__nbl-ageBadge').attr('class').match(/\d+/g).toString() || null;
                arr.push({ id: uuid(), title, imgLink, movieId, ageLimit });
            })
        }
    })
    await wait(6000)
    res.json({ data: JSON.stringify(arr) });
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});