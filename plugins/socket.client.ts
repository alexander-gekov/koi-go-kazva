import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('http://localhost:3000')

    return {
        provide: {
            socket: socket
        }
    }
})