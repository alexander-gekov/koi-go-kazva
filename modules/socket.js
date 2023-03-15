import { Server } from 'socket.io'

export default (_, nuxt) => {
    nuxt.hook('listen', server => {
        const io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: '/socket-io/'	
        })
        const rooms = {};

        nuxt.hook('close', () => io.close())
        
        io.on('connection', (socket) => {
            socket.on('message', (data) => {
                switch (data['message']) {
                    case 'create':
                        socket.join(data['room'])
                        rooms[data['room']] = data['data']
                        rooms[data['room']].owner = socket.id
                        break;
                    case 'join':
                        socket.join(data['room'])
                        const roomId = data['room']
                        if(rooms[roomId]) {
                            socket.emit('message', {message: 'loadGameData', data: rooms[roomId]})
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