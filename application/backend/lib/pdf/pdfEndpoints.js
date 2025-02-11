import express from "express";
import path, { dirname } from "path";
import { kassenbericht, kassenzettel, riderPdf, vermietungAngebot, vertrag } from "./pdfGeneration.js";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.get("/kassenbericht/:year/:month", async (req, res, next) => {
    const datum = DatumUhrzeit.forYYYYMM(req.params.year + "" + req.params.month);
    kassenbericht(res, next, datum);
});
app.get("/kassenzettel/:filename", async (req, res, next) => {
    const url = req.query["url"];
    if (url) {
        kassenzettel(res, next, url);
    }
});
app.get("/vertrag/:filename", async (req, res, next) => {
    const url = req.query["url"];
    const language = req.query["language"];
    if (url && language) {
        vertrag(res, next, url, language);
    }
});
app.get("/vermietungAngebot/:filename", async (req, res, next) => {
    const url = req.query["url"];
    const art = req.query["art"];
    if (url && art) {
        vermietungAngebot(res, next, url, art);
    }
});
app.get("/rider/:url", async (req, res, next) => {
    riderPdf(res, next, req.params.url);
});
export default app;
