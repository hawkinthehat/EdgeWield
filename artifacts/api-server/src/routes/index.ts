import { Router, type IRouter } from "express";
import healthRouter from "./health";
import oddsRouter from "./odds";
import checkoutRouter from "./checkout";
import scanRouter from "./scan";
import syncRouter from "./sync";
import maintenanceRouter from "./maintenance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(oddsRouter);
router.use(checkoutRouter);
router.use(scanRouter);
router.use(syncRouter);
router.use(maintenanceRouter);

export default router;
