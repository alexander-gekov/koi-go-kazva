import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-qdvzk.ondigitalocean.app:8080', {rejectUnauthorized: false})

    return {
        provide: {
            socket: socket
        }
    }
})