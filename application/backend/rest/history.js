import express from "express";
import { resToJson } from "../lib/commons/replies.js";
import { loadHistoryRows, loadLatestChangedObjectsOverview } from "../lib/history/historyService.js";
const app = express();
app.get("/history/:collection/:id", (req, res) => {
    const collection = req.params.collection;
    const id = req.params.id;
    const result = loadHistoryRows({ collection, id });
    resToJson(res, result);
});
app.get("/history/:collection", (req, res) => {
    const collection = req.params.collection;
    const result = loadLatestChangedObjectsOverview({ collection });
    resToJson(res, result);
});
export default app;
