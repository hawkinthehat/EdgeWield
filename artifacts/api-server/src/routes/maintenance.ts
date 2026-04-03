import { Router, type IRouter } from "express";
import { supabase } from "../lib/supabase";

const router: IRouter = Router();

router.get("/maintenance/cleanup", async (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: "Supabase not configured" });
    return;
  }

  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("live_arbs")
    .delete()
    .lt("created_at", fourHoursAgo);

  if (error) {
    req.log.error({ error }, "Maintenance cleanup failed");
    res.status(500).json({ error: error.message });
    return;
  }

  req.log.info({ cleaned: data }, "Maintenance cleanup complete");
  res.json({ status: "Maintenance Complete", cleaned: data });
});

export default router;
