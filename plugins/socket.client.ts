import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = process.env.NODE_ENV === 'production' ? io('https://coral-app-lhhho.ondigitalocean.app', {reconnection: false, secure:true, rejectUnauthorized: false}) : io()

    return {
        provide: {
            socket: socket
        }
    }
})