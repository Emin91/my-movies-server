const express = require('express');
require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const { v4: uuid } = require('uuid');

const port = process.env.PORT || 80
const arr = [];
const movieInfo = {}

request('https://www.ivi.az/collections/best-movies', (error, response, html) => {
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

async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}

app.get('/movie/:id', (req, res) => {
    const qualityList = [];
    const actorsInfo = [];
    const movieCategories = [];
    const commentaries = [];
    console.log('first', `https://www.ivi.az/watch/${req.params.id}`)

    request(`https://www.ivi.az/watch/${req.params.id}`, async (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const rootPath = '#root > section > div > div > div > div > div.contentCard';
            const description = $(`${rootPath}__info > div.watchDescription.contentCard__watchDescription > div > div > div`).text();
            const year = $(`${rootPath}__player > div.watchParams.contentCard__watchParams > ul:nth-child(1) > li:nth-child(1) > a`).text();
            const timeRange = $(`${rootPath}__player > div.watchParams.contentCard__watchParams > ul:nth-child(1) > li:nth-child(2) > a`).text();
            const rating = $('.ratingDesktop__split').children().first().text();
            const ratingCount = $('.ratingDesktop__split').children().first().next().text();

            movieInfo.year = year;
            movieInfo.rating = rating;
            movieInfo.timeRange = timeRange;
            movieInfo.ratingCount = ratingCount;
            movieInfo.description = description;
            $('.watchParams__item.watchParams__item_hasDot').each((i, el) => {
                movieCategories.push({
                    link: $(el).find('a').attr('href'),
                    name: $(el).text(),
                });
                movieInfo.categories = movieCategories;
            })
            movieInfo.description = description;
            $('.nbl-textBadge.nbl-textBadge_size_nokro.nbl-textBadge_style_rolin.nbl-textBadge_isShadowEnabled_1.watchOptions__nbl-textBadge').each((i, el) => {
                qualityList.push({
                    id: uuid(),
                    quality: $(el).find('.nbl-textBadge__text').text(),
                });
                movieInfo.qualities = qualityList;
            })
            $('.nbl-medallion.nbl-medallion_type_inkur.nbl-medallion_size_cobra.watchMedallions__nbl-medallion').each((i, el) => {
                actorsInfo.push({
                    id: uuid(),
                    name: $(el).find('.nbl-medallion__caption').text(),
                    photo: $(el).find('.nbl-avatar__image').attr('src'),
                    profileUrl: $(el).attr('href'),
                });
                movieInfo.actorsInfo = actorsInfo;
            });
            $('.ugcTile.gallery__ugcTile').each((i, el) => {
                commentaries.push({
                    id: uuid(),
                    author: $(el).find('.ugcTile__author').text(),
                    text: $(el).find('.ugcTile__textBlock').text(),
                    vote: $(el).find('.vote__value').text(),
                    createdAt: $(el).find('.ugcTile__date').text(),
                });
                movieInfo.commentaries = commentaries
            })
        }
        await wait(2000);
        res.send(movieInfo);
    })

});

app.get('/', async (req, res) => {
    res.json({ data: 'JSON.stringify(arr)' });
});


app.listen(port, () => {
    console.log('Running on port: ' + port);
});