import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-rqk73.ondigitalocean.app:8080', {reconnection: false, secure:false})

    return {
        provide: {
            socket: socket
        }
    }
})