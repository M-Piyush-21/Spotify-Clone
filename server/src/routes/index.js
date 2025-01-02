import { Router } from "express";
import authRoutes from "./auth.routes.js";
import songRoutes from "./song.routes.js";
import albumRoutes from "./album.routes.js";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/song", songRoutes);
rootRouter.use("/album", albumRoutes);

export default rootRouter;
