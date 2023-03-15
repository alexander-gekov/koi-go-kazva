import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-rqk73.ondigitalocean.app:3000', {reconnection: false, secure:false, rejectUnauthorized: false})

    return {
        provide: {
            socket: socket
        }
    }
})