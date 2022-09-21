const express = require('express')
const handlebars = require("express-handlebars")
const app = express()

const fs = require("fs");
const fsPromise = fs.promises;

const db = require("./funciones")
const DB = new db("./Data/productos.json");


const {Server: SocketServer} = require('socket.io')
const {Server: HTTPServer} = require('http')

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)


app.use(express.urlencoded({extended:true}))
app.use(express.json())


let mensajes = [{
    email: "pablo@gmmail.com",
    msj: "hola mundo"
}, {
    email: "jose@gmmail.com",
    msj: "hola coder"
}, {
    email: "fernando@gmmail.com",
    msj: "hola todos"
}]

app.use(express.static("views"))

const hbs = handlebars.engine({
    extname: "hbs",
    layoutsDir:__dirname + "/views/layouts",
    defaultLayout: "principal",

});

app.engine("hbs",hbs)

app.set('view engine', 'hbs')


app.set("views", __dirname + "/views");
app.set("view engine", "hbs");


io.on("connection", (socket) => {
    console.log("cliente conectado")
    socket.emit("new-message",mensajes)

    socket.on("new-message",(data) => {
        console.log(data)
        mensajes.push(data)
        io.sockets.emit("new-message", mensajes)

    })

})

app.get("/",(req, res)=>{
    res.render("main",{layout: "principal"})
    
})


app.listen(8080, () => {
    console.log(`tarea websocket iniciado`)
})
