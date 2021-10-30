var typeorm = require("typeorm");
var EntitySchema = typeorm.EntitySchema;


const initDB = async () => {
    try {
        await typeorm.createConnection({
            type: "mysql",
            host: process.env.SQL_SERVER_ADDR,
            port: process.env.SQL_SERVER_PORT,
            username: process.env.SQL_SERVER_USER,
            password: process.env.SQL_SERVER_PASSWORD,
            database: process.env.SQL_SERVER_DATABASE,
            synchronize: true,
            entities: [
                new EntitySchema(require("../../evouchercms/models/evoucher")),
                new EntitySchema(require("../../evouchercms/models/paymentMethodDiscount")),
                new EntitySchema(require("../../estore/models/order")),
            ]
        });
    } catch (e) {
        console.log(e)
    }
}

exports.initDB = initDB