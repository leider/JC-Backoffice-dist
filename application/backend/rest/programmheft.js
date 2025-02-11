import express from "express";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import Kalender from "jc-shared/programmheft/kalender.js";
import store from "../lib/programmheft/kalenderstore.js";
import { resToJson } from "../lib/commons/replies.js";
import { checkOrgateam } from "./checkAccessHandlers.js";
const app = express();
app.get("/programmheft/alle", [checkOrgateam], (req, res) => {
    const alleKalender = store.alleKalender();
    resToJson(res, alleKalender);
});
app.get("/programmheft/:year/:month", [checkOrgateam], (req, res) => {
    let yearMonthString = `${req.params.year}/${req.params.month}`;
    if (parseInt(req.params.month) % 2 === 0) {
        const correctedDatum = DatumUhrzeit.forYYYYslashMM(yearMonthString).naechsterUngeraderMonat;
        yearMonthString = correctedDatum.fuerKalenderViews;
    }
    const kalender = store.getKalender(yearMonthString);
    kalender?.sortEvents();
    resToJson(res, kalender);
});
app.post("/programmheft", [checkOrgateam], (req, res) => {
    const kalender = new Kalender(req.body);
    store.saveKalender(kalender, req.user);
    resToJson(res, kalender);
});
export default app;
