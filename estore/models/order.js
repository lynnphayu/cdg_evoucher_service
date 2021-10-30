module.exports = {
    name: "Order",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
        },
        phone: {
            type: "varchar",
            isNullable: false
        },
        payment_method: {
            type: "varchar"
        },
        total: {
            type: "int",
            isNullable: true
        },
        order_status: {
            type: "varchar",
            default: "checkout"
        },
        promoCodeId: {
            type: "int",
            default: null,
            isNullable: true
        },
        created_at: {
            type: "timestamp",
        },
    },
    relations: {
        evoucher: {
            target: "Evoucher",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    },
};