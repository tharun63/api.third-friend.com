// third party modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";
import * as http from 'http'

import * as socketio from 'socket.io';
// routes
import routes from "./routes/index";

// config
import AppConfig from "../config/app";
import path from "path";

// middlewares
import errorMiddleware from "./middlewares/errorHandlerMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
class App {
  public app: express.Application;
  public server: any;
  public io: any
  public mongoUrl: string = AppConfig.db.mongo_connection_string;
  public mongoOptions = {
  };

  constructor() {
    this.app = express();
    this.config();
    this.initializeErrorHandling();
    this.mongoSetup();
    this.app.use("/" + AppConfig.app.api_version, routes);
    this.app.use(errorMiddleware);
    this.app.use((req, res, next) => {
      return res.status(404).send();
    });
    this.handlingUnCaughtRejections();
    this.server = http.createServer(this.app);
    this.io = new socketio.Server(this.server, {
      cors: {
        origin: "*"
      }
    });
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.static("public"));
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
    this.app.use(logger("dev"));
    this.app.use(helmet());
    this.app.use(bodyParser.json({ limit: "5mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
  }

  private mongoSetup() {
    mongoose.connect(this.mongoUrl, this.mongoOptions)
      .then(() => {
        console.info("Successfully connected mongoose");
      })
      .catch((err: any) => {
        console.error("Error while connecting to mongoose", err);
      });
  
  }

  private initializeErrorHandling() {
    this.app.use(errorHandlerMiddleware);
  }

  private handlingUnCaughtRejections() {
    process.on("unhandledRejection", function (err) {
      // Todo - add sentry log here
      console.log("unhandledRejection", err);
      process.exit(1);
    });

    process.on("uncaughtException", function (err) {
      // Todo - add sentry log here
      console.log("uncaughtException", err);
      process.exit(1);
    });
  }
}
const app = new App()

export const server = app.server
export const io = app.io
// export default new App().app;
