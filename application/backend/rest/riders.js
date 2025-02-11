import express from "express";
import store from "../lib/rider/riderstore.js";
import { resToJson } from "../lib/commons/replies.js";
import { Rider } from "jc-shared/rider/rider.js";
import { checkOrgateam } from "./checkAccessHandlers.js";
const app = express();
app.get("/riders/:url", (req, res) => {
    resToJson(res, store.getRider(req.params.url));
});
app.post("/riders", [checkOrgateam], (req, res) => {
    if (req.body) {
        const rider = new Rider(req.body);
        store.saveRider(rider, req.user);
        resToJson(res, rider);
        return;
    }
});
export default app;
