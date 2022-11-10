import DBcontainer from "./connection/funciones.js";
import sqliteConfig from "./connection/sqlite3.js";
sqliteConfig.connection.filename = "./DB/ecommerce.sqlite"

const DBmensajes = new DBcontainer(sqliteConfig, "mensajes")
import {denormalize,normalize,schema} from 'normalizr';
import util from 'util';


const Normalizr = async () => {
    const db = await DBmensajes.getAll()
    const parse = db.map((mensaje) => {
        return {
            author: {
                id: mensaje.email,
                nombre: mensaje.name,
                apellido: mensaje.apellido,
                edad: mensaje.edad,
                alias: mensaje.alias,
                avatar: mensaje.avatar
            },
            msj: {
                id: mensaje.id,
                msj: mensaje.msj
            }
        }
    })

    const authorSchema = new schema.Entity("author", parse.author)

    const msjSchema = new schema.Entity("msj", parse.msj)

    const schemaCompleto = new schema.Entity("chat", {
        author: authorSchema,
        msj: msjSchema
    })

    const normalizeData = normalize(parse, [schemaCompleto])

    const DataCompleta = JSON.stringify(db).length
    const DataParseada = JSON.stringify(normalizeData).length

    const Porcentaje = (DataCompleta - DataParseada) / DataCompleta * 100
    const PorcentajeData = (`se ahorro ${Porcentaje} de lineas`)

    return {normalizeData,PorcentajeData}
}

export default Normalizr
