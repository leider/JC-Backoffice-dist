import express from "express";
import service from "../lib/konzerte/imageService.js";
import { resToJson } from "../lib/commons/replies.js";
import calendarApp from "./calendar.js";
import historyApp from "./history.js";
import mailsenderApp from "./mail.js";
import optionenApp from "./optionen.js";
import programmheftApp from "./programmheft.js";
import ridersApp from "./riders.js";
import usersApp from "./users.js";
import konzerteRestApp from "./konzerte.js";
import vermietungenRestApp from "./vermietungen.js";
import wikiApp from "./wiki.js";
import { checkSuperuser } from "./checkAccessHandlers.js";
const app = express();
app.use("/", calendarApp);
app.use("/", historyApp);
app.use("/", mailsenderApp);
app.use("/", optionenApp);
app.use("/", programmheftApp);
app.use("/", ridersApp);
app.use("/", usersApp);
app.use("/", konzerteRestApp);
app.use("/", vermietungenRestApp);
app.use("/", wikiApp);
async function allImageNames(res) {
    const imagenamesOfFiles = await service.alleBildNamen();
    resToJson(res, { names: imagenamesOfFiles });
}
app.get("/imagenames", (req, res) => {
    allImageNames(res);
});
app.post("/imagenames", [checkSuperuser], async (req, res) => {
    const rows = req.body;
    await service.renameImages(rows, req.user);
    allImageNames(res);
});
export default app;
