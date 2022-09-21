const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const fs = require("fs");
const DB = require("./funciones")
const db = new DB("./Data/productos.json");


const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const httpServer = new HTTPServer(app);

const io = new SocketServer(httpServer);

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

app.get("/",async (req,res) => {
    res.render("main", {layout:"principal",compras:await db.getAll()})
})

io.on("connection",async (socket)=>{
    console.log("conectado")

    socket.emit("mensajes",mensajes)
    socket.emit("productos", await db.getAll())

    socket.on("new_msj",(data)=>{
        mensajes.push(data)
        io.sockets.emit("mensajes",mensajes)
    })
    socket.on("new_producto",async (prod)=>{
        await db.save(prod)

        const productos = await db.getAll()
        io.sockets.emit("productos",productos)
    })
})

httpServer.listen(8080, () => {
    console.log(`HBS iniciado`)
})