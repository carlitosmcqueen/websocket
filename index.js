import express from 'express';
import handlebars from "express-handlebars"
const app = express();

import DBcontainer from "./connection/funciones.js"
import mysqlconnection from "./connection/db.js"
import sqliteConfig from "./connection/sqlite3.js"
sqliteConfig.connection.filename = "./DB/ecommerce.sqlite"
const DBMensajes =  new DBcontainer(sqliteConfig, 'mensajes');
const DBProductos =  new DBcontainer(mysqlconnection, 'productos');


import { Server } from 'socket.io';
import { createServer } from 'http';
const httpServer = createServer(app); 
const io = new Server(httpServer);

import randomProductos from "./faker/fakerProductos.js"
import Normalizr from "./normalizr.js"

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("views"));



const hbs= handlebars.engine({
    extname: "hbs",
    layoutsDir: "./views/layouts"
    
})

app.engine("hbs",hbs)
app.set("view engine","hbs")

app.get("/", async (req,res) => {
    res.render("main", {layout:"principal",compras: await DBProductos.getAll()})
})
app.get("/productos-test", async (req, res) => {
    res.render("main", {
      layout: "productos-test",

    });
  });


io.on("connection", async (socket)=>{

    socket.emit("new_msj", await Normalizr())
    socket.on("new_msj",async (data)=>{
        console.log(data)
        await DBMensajes.save(data)
        io.sockets.emit("new_msj", await Normalizr() )
    })

    //eso para productos test
    socket.emit('randomProducts', randomProductos());

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