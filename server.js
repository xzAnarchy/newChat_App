const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)


// middleware

app.use(express.static('./public'))

const PORT = 8888

const messages = [
    { author: 'Pablo', text: 'Hola, que tal' },
    { author: 'Marcelo', text: 'muy bien y tu?' },
    { author: 'Belen', text: 'Hola!!' }
]


// Implementacion de socket
io.on('connection', socket => {
    console.log('nuevo cliente conectado');

    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('message', messages)

    // una vez escuchamos al cliente y recibimos un mensaje, realizamos el envio a todos los demas pusheandolo a un array
    socket.on('new-message', data => {
        messages.push(data)

        // re enviamos por medio broadcast los msn a todos los clientes que esten conectados en ese momento
        io.sockets.emit('message', messages)
    })


})

httpServer.listen(PORT, () => {
    console.log(`server run on Port: ${PORT}`)
})