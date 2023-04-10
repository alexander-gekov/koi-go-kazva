import io from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket =
    process.env.NODE_ENV === "production"
      ? io("https://koi-go-kazva-ws-qn7ap.ondigitalocean.app", {
          reconnection: false,
          secure: true,
          rejectUnauthorized: false,
        })
      : io();

  return {
    provide: {
      socket: socket,
    },
  };
});
