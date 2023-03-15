import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
    const socket = io('https://koi-go-kazva-ws-gvgzl.ondigitalocean.app:8080', {secure: true, rejectUnauthorized: false})

    return {
        provide: {
            socket: socket
        }
    }
})