import { NextFunction, Request, Response, Router } from "express";
import ejs from "ejs";


import { index } from "./../views/index";
import user from './user'
import AppConfig from "../../config/app";
import journey from "./journey"

const router: Router = Router();
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.send(
    ejs.render(index, {
      title: "ThirdFriend",
      version: AppConfig.app.api_version.toUpperCase(),
    })
  );
});



router.use(user);
router.use(journey);



export default router;
