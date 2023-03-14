import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva.vercel.app')

    return {
        provide: {
            socket: socket
        }
    }
})