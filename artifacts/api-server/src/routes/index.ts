import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fppRouter from "./fpp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fppRouter);

export default router;
