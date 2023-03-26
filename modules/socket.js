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
                        rooms[data['room']].players = [{name: data['username'], score: 0, isGameOver: false}];
                        break;
                    case 'join':
                        socket.join(data['room'])
                        const roomId = data['room']
                        if(rooms[roomId]) {
                            rooms[roomId].players.push({name: data['username'], score: 0, isGameOver: false})
                            socket.emit('message', {message: 'loadGameData', data: rooms[roomId]})
                            socket.emit('message', {message: 'loadPlayers', data: [... new Set(rooms[roomId].players)]})
                            socket.to(roomId).emit('message', {message: 'loadPlayers', data: [... new Set(rooms[roomId].players)]})
                        }
                        break
                    case 'gameOver':
                        const room = data['room']
                        if(rooms[room]) {
                            rooms[room].players = rooms[room].players.map(player => {
                                if(player.name == data['username']) {
                                    player.isGameOver = true;
                                }
                                return player
                            })
                            socket.emit('message', {message: 'loadPlayers', data: [... new Set(rooms[room].players)]})
                            socket.to(room).emit('message', {message: 'loadPlayers', data: [... new Set(rooms[room].players)]})
                        }
                        break
                    case 'correctAnswer':
                        const room1 = data['room']
                        console.log(data);
                        if(rooms[room1]) {
                            rooms[room1].players = rooms[room1].players.map(player => {
                                if(player.name == data['username']) {
                                    player.score = data['score']
                                }
                                return player
                            })
                            socket.emit('message', {message: 'loadPlayers', data: [... new Set(rooms[room1].players)]})
                            socket.to(room1).emit('message', {message: 'loadPlayers', data: [... new Set(rooms[room1].players)]})
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
        
            socket.on('disconnecting', () => {
                socket.rooms.forEach(room => {
                    if(rooms[room]){
                        rooms[room].players.splice(rooms[room].players.indexOf(socket.id), 1)
                        socket.to(room).emit('message', {message: 'loadPlayers', data: [... new Set(rooms[room].players)]})
                    }
                })
                console.log('user ' + socket.id + ' disconnected');
              });
        })
    })
}