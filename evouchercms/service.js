const { getConnection } = require("typeorm");



const createVoucher = ({
    title,
    description,
    image,
    payment_method,
    amount,
    quantity,
    buy_type,
    expiry_date,
    payment_method_discount,
    limit,
    gift_limit
}) => {
    const DBInstance = getConnection();
    const mockVoucher = {
        title,
        description,
        image,
        expiry_date,
        payment_method,
        amount,
        quantity,
        buy_type,
        limit,
        gift_limit,
        payment_method_discount
    }
    const voucherRepo = DBInstance.getRepository("Evoucher");
    return voucherRepo.save(mockVoucher)
}

const editVoucher = (id, operands) => {
    const DBInstance = getConnection();
    const treeSkakenObj = Object.fromEntries(Object.entries(operands).filter(([_, v]) => v != null));
    const voucherRepo = DBInstance.getRepository("Evoucher");
    return voucherRepo.update({ id }, treeSkakenObj)
}

exports.createVoucher = createVoucher
exports.editVoucher = editVoucher