const { Router } = require('express')
const { createVoucher, editVoucher } = require('./service')

const router = Router();

router.post('/create', async (req, res) => {
    const {
        title,
        description,
        image,
        expiry_date,
        payment_method,
        amount,
        quantity,
        payment_method_discount,
        buy_type,
        limit,
        gift_limit
    } = req.body;
    createVoucher({
        title,
        description,
        image,
        expiry_date,
        payment_method,
        amount,
        payment_method_discount,
        quantity,
        buy_type,
        limit,
        gift_limit
    }).then((e) => res.send(e))
})

router.post('/edit/:id', async (req, res) => {
    const {
        title,
        description,
        image,
        expiry_date,
        payment_method,
        amount,
        quantity,
        payment_method_discount,
        buy_type,
        limit,
        gift_limit
    } = req.body;
    const {
        id
    } = req.params
    editVoucher(id, {
        title,
        description,
        image,
        expiry_date,
        payment_method,
        amount,
        payment_method_discount,
        quantity,
        buy_type,
        limit,
        gift_limit
    }).then((e) => res.send(e))
})

module.exports = router;