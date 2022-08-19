import express from 'express'
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import db from './db/sqlBase.js'


const app = express()
const PORT = 8080;

const server = app.listen(PORT,()=>{
    console.log(`Èscuchando en el puerto ${PORT}`)
})

app.get('/prueba',async(req,res)=>{
    try {
        let siu = await db('chat')
        .del().where('user', '=', 'qw')
        res.send(siu);
    } catch (error) {
        console.log(error)
    }
})



const io = new Server(server);
app.use(express.json());
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars')
app.use(express.static(__dirname+'/public'))



io.on('connection',async(socket)=>{
    console.log("Socket connected")
    let datos = await db('products').select('*')
    let log = await db('chat').select('*')
    io.emit('lista',datos)
    io.emit('log',log)

    socket.on('message',async data=>{
    let date = new Date().toISOString()
    data.fecha= date;
    await db('chat').insert(data)
    let log = await db('chat').select('*')
       io.emit('log',log)
    })


    socket.on('newProducto',async data=>{
        await db('products').insert(data)
        let datos = await db('products').select('*')
        io.emit('lista',datos)
    })
})

app.get('/',async(req,res)=>{

        let productos = await db('products').select('*')
        res.render('formulario',{
            productos
        })
})



