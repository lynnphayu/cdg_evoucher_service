module.exports = {
    name: "PaymentMethodDiscount",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        payment_method: {
            type: "varchar"
        },
        discount: {
            type: "int",
            default: 0
        }
    }
};