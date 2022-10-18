import express from 'express';
import handlebars from "express-handlebars"
const app = express();

import DBcontainer from "./connection/funciones.js"

import mysqlconnection from "./connection/db.js"
import sqliteConfig from "./connection/sqlite3.js"
sqliteConfig.connection.filename = "./DB/ecommerce.sqlite"


import { Server } from 'socket.io';
import { createServer } from 'http';
 
const httpServer = createServer(app); 
const io = new Server(httpServer);

const DBMensajes =  new DBcontainer(sqliteConfig, 'mensajes');
const DBProductos =  new DBcontainer(mysqlconnection, 'productos');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("views"));

const mensajes = []

const hbs= handlebars.engine({
    extname: "hbs",
    layoutsDir: "./views/layouts"
    
})

app.engine("hbs",hbs)
app.set("view engine","hbs")

app.get("/", async (req,res) => {
    res.render("main", {layout:"principal",compras: await DBProductos.getAll()})
})

io.on("connection", async (socket)=>{
    console.log("sea conectado el cliente")
    socket.emit("new_msj",mensajes)
    socket.on("new_msj",async (data)=>{
        console.log(data)
        await DBMensajes.save(data)
        mensajes.push(data)
        io.sockets.emit("new_msj",mensajes)
    })
    socket.emit("new_producto", await DBProductos.getAll())
    socket.on("new_producto", async (prod)=>{
        await DBProductos.save(prod)
        const productos = await DBProductos.getAll()
        io.sockets.emit("new_producto",productos)
    })
})


httpServer.listen(8080, () => {
    console.log(`HBS iniciado`)
})