const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const EvoucherServiceRouter = require('./evouchercms/resolver');
const StoreServiceRouter = require('./estore/resolver')
const { initDB } = require('./adapters/db')
const { spinupRedis, rd } = require('./adapters/redis');
const { simpleGetREST } = require('./adapters/http');
require('reflect-metadata');


console.log(process.env.REFRESH_TOKEN_ENDPOINT)
cron.schedule('0 0 */22 * * *', () => {
    rd.get('refresh_token').then(
        (r_token) => simpleGetREST({
            url: process.env.REFRESH_TOKEN_ENDPOINT,
            body: { refresh_token: r_token }
        }))

});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initDB().then(() => {
    spinupRedis.then(() => {
        app.use('/admin', EvoucherServiceRouter);
        app.use('/store', StoreServiceRouter);

        app.listen(3030, () => console.info('SERVING ESTORE & CMS .'));
    })
})

