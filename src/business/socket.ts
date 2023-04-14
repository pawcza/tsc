import {io} from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000";

// @ts-ignore
export const socket = io(URL);
