import { io } from "socket.io-client";
import { getSafeApiUrl } from "./helpers";

// We extract the domain/port without the /api path
const apiOrigin = getSafeApiUrl("").replace(/\/api$/, "");

export const socket = io(apiOrigin, {
  autoConnect: false,
  withCredentials: true,
});
