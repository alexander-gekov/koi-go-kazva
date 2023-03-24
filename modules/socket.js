import { Server } from 'socket.io'

export default (_, nuxt) => {
    nuxt.hook('listen', server => {
        const io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: process.env.NODE_ENV === 'production' ? '/socket-io/' : ''	
        })
        const rooms = {};

        nuxt.hook('close', () => io.close())
        
        io.on('connection', (socket) => {
            socket.on('message', (data) => {
                switch (data['message']) {
                    case 'create':
                        socket.join(data['room'])
                        rooms[data['room']] = data['data']
                        rooms[data['room']].owner = socket.id;
                        rooms[data['room']].players = [data['username']];
                        break;
                    case 'join':
                        socket.join(data['room'])
                        const roomId = data['room']
                        if(rooms[roomId]) {
                            rooms[roomId].players.push(data['username'])
                            socket.emit('message', {message: 'loadGameData', data: rooms[roomId]})
                            socket.emit('message', {message: 'loadPlayers', data: [... new Set(rooms[roomId].players)]})
                            socket.to(roomId).emit('message', {message: 'loadPlayers', data: [... new Set(rooms[roomId].players)]})
                        }
                        break
                    case 'leave':
                        socket.leave(data['room'])
                        if(socket.rooms.size == 0) {
                            delete rooms[data['room']]
                        }
                        break
                }
            })
        
            socket.on('disconnect', () => {
                console.log('user ' + socket.id + ' disconnected');
              });
        })
    })
}