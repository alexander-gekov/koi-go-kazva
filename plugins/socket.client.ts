import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-rqk73.ondigitalocean.app', {reconnection: false, secure:false, rejectUnauthorized: false})

    return {
        provide: {
            socket: socket
        }
    }
})