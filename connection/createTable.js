import knex from "knex";
import connection from "./db.js";
import sqliteConfig from "./sqlite3.js"

const KnexSQL = knex(connection)
const KnexSQL3 = knex(sqliteConfig)

KnexSQL3.schema.createTableIfNotExists("mensajes", (table) => {
    table.increments("id");
    table.string("date");
    table.string("name");
    table.string("apellido")
    table.string("alias");
    table.string("avatar");
    table.integer("edad");
    table.string("email");
    table.string("msj");
}).then(() => {
    console.log("tabla de mensajes creada");
}).catch((e) => {
    console.log(e);
}).finally(() => {
    KnexSQL.destroy();
});


// KnexSQL.schema.createTableIfNotExists("productos", (table) => {
//     table.increments("id");
//     table.string("title");
//     table.integer("price");
//     table.string("thumbnail");
// }).then(() => {
//     console.log("Tabla de productos creada");
// }).catch((e) => {
//     console.log(e);
// }).finally(() => {
//     KnexSQL.destroy();
// });