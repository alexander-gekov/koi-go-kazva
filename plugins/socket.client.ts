import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://coral-app-lhhho.ondigitalocean.app', {reconnection: false, secure:true, rejectUnauthorized: false})

    return {
        provide: {
            socket: socket
        }
    }
})