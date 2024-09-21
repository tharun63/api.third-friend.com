import { server, io } from "./app";
import config from '../config/app'

io.on("connection", (data) => {
  // console.log("connected to SocketIo")
})
server.listen(config.app.port, () => {
  console.log("Express server listening on port " + config.app.port);
});