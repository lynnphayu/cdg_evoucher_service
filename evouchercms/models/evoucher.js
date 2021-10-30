module.exports = {
    name: "Evoucher",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar"
        },
        description: {
            type: "varchar"
        },
        expiry_date: {
            type: "date"
        },
        image: {
            type: "varchar"
        },
        // payment_method: {
        //     type: "varchar",
        // },
        limit: {
            type: "int",
            default: 0
        },
        gift_limit: {
            type: "int",
            default: 0
        },
        amount: {
            type: "int"
        },
        quantity: {
            type: "int"
        },
        buy_type: {
            type: "varchar"
        },
    },
    relations: {
        payment_method_discount: {
            target: "PaymentMethodDiscount",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
};