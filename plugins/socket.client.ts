import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-qdvzk.ondigitalocean.app:3000')

    return {
        provide: {
            socket: socket
        }
    }
})