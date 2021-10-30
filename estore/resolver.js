const { Router } = require('express');
const { simpleGetREST } = require('../adapters/http');
const { getVouchers, getVoucher, checkout, pay, purchaseHistory, verifyPromocode } = require('./service')

const router = Router();

router.get('/get', async (req, res) => {
    getVouchers().then((e) => res.send(e)).catch((e) => res.sendStatus(500))
})

router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    getVoucher(id).then((e) => res.send(e)).catch((e) => res.sendStatus(500))
})

router.get('/purchase_history/:phone', async (req, res) => {
    const { phone } = req.params;
    purchaseHistory(phone).then((e) => res.send(e)).catch((e) => res.sendStatus(500))
})

router.get('/verify_promocode/:code', async (req, res) => {
    const { code } = req.params;
    verifyPromocode(code).then((e) => res.send(e)).catch((e) => {
        console.log(e)
        res.sendStatus(500)
    })
})

router.post('/checkout', async (req, res) => {
    const {
        name, phone, evoucher, paymentmethod
    } = req.body
    if (!name || !phone || !evoucher) {
        res.status(400).send("Something is wrong with your request")
    }
    checkout({
        name, phone, evoucher, paymentmethod
    }).then((e) => res.send(e)).catch((e) => res.status(500))
})

router.post('/pay', async (req, res) => {
    const {
        name, phone, order, cardNo
    } = req.body
    if (!name || !phone || !order || !cardNo) {
        res.status(400).send("Something is wrong with your request")
    }

    const resBody = await pay({
        name, phone, order, cardNo
    })
    res.send(resBody)
})


module.exports = router;