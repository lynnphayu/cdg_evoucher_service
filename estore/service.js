const { getConnection } = require("typeorm");
const valid = require("card-validator");
const bQueue = require('bee-queue');
const { authGuard } = require("../adapters/http");

const queue = new bQueue('evoucher_order_payment_success_pipe', {
    removeOnSuccess: true,
    redis: {
        host: process.env.REDIS_SERVER_ADDR,
        port: process.env.REDIS_SERVER_PORT
    },
});


const getVouchers = () => {
    const voucherRepo = getConnection().getRepository("Evoucher");
    return voucherRepo.find({ relations: ['payment_method_discount'] });
}

const getVoucher = (id) => {
    const voucherRepo = getConnection().getRepository("Evoucher");
    return voucherRepo.findOne(id, { relations: ['payment_method_discount'] });
}

const checkout = ({
    name, phone, evoucher,
    // payment_method
}) => {
    const voucherRepo = getConnection().getRepository("Evoucher");
    const orderRepo = getConnection().getRepository("Order");
    return voucherRepo.findOne(evoucher, { relations: ['payment_method_discount'] }).then((voucher) => {
        if (!voucher) {
            return "no voucher found!"
        }
        if (new Date(voucher.expiry_date).getTime() < Date.now()) {
            return "invalid voucher"
        }
        const orderContainer = {
            name, phone, evoucher, created_at: new Date(), payment_method: "", total: -1,
        }
        return orderRepo.save(orderContainer)
    })
}


// needs proper error handling

const pay = ({
    name, phone, order, cardNo
}) => {
    const orderRepo = getConnection().getRepository("Order")
    const voucherRepo = getConnection().getRepository("Evoucher")
    return orderRepo.findOne(order, { relations: ['evoucher'] }).then((order) => {
        if (!order) return "Cant purchase this order";
        return voucherRepo.findOne(order.evoucher.id, { relations: ['payment_method_discount'] }).then((ev) => {
            var validation = valid.number(cardNo);
            if (!validation.isPotentiallyValid) {
                return "Invalid Card"
            }
            if (!validation.card) {
                return "Invalid Card"
            }
            if (order.order_status !== "checkout") {
                return "Cant purchase this order"
            }
            var total = ev.amount
            if (validation.card.type === ev.payment_method_discount.payment_method) {
                total -= total * (voucher.payment_method_discount.discount / 100)
            }
            return orderRepo.update({ id: order.id },
                { total, order_status: "paid", payment_method: validation.card.type }).then((e) => {
                    const pendingQRProduction = queue.createJob({
                        name, phone, evoucher: ev.id
                    })
                    pendingQRProduction.save();
                    pendingQRProduction.on('succeeded', async (result) => {
                        await orderRepo.update({ id: order.id }, { order_status: "succeed" })
                        // dispatch mailing or something here to send qr and promo
                        console.info("-- QR&PROMOTION GENERATION FINISHED")
                        console.log(result)
                        await orderRepo.update({ id: order.id }, { promoCodeId: result.id })
                    });
                    return {
                        ...order,
                        total,
                        evoucher: ev,
                    }
                })

        })
    }
    )

}

const verifyPromocode = async (promocode) => {
    const voucherRepo = getConnection().getRepository("Evoucher")
    const promCodes = await authGuard()({ url: process.env.PROMO_BY_CODE + promocode })
    if (promCodes.length > 0){
        const voucher = await voucherRepo.findOne(parseInt(promCodes[0].evoucher))
        if(new Date(voucher.expiry_date).getTime() < Date.now()){
            return "Expired"
        }
        return promCodes[0].status
    }
    return {}
}

const purchaseHistory = async (phone) => {
    const orderRepo = getConnection().getRepository("Order")
    const purchasedOrders = await orderRepo.find({ phone, relations: ['evoucher'] })
    const promCodes = await authGuard()({ url: process.env.PERSONAL_PROMO_LIST_BY_PHONE + phone })
    const purchaseHistory = purchasedOrders.reduce((acc, cur) => {
        const promCode = promCodes.find((e) => e.id === cur.promoCodeId)
        if (promCode) return acc.concat([{ ...promCode, ...cur }])
        return acc
    }, [])
    return purchaseHistory
}



exports.getVouchers = getVouchers;
exports.getVoucher = getVoucher;
exports.checkout = checkout;
exports.pay = pay;
exports.purchaseHistory = purchaseHistory
exports.verifyPromocode = verifyPromocode