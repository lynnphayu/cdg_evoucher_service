module.exports = {
    name: "PurchasedEvoucher",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        customer_name: {
            type: "varchar"
        },
        customer_phone: {
            type: "varchar"
        },
        expiry_date: {
            type: "varchar"
        },
        image: {
            type: "varchar"
        },
        payment_method: {
            type: "enum"
        },
        relations: {
            evoucher: {
                target: "Evoucher",
                type: "one-to-one",
                joinTable: true,
                cascade: true
            }
        }
    }
};