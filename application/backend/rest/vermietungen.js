import express from "express";
import Vermietung from "jc-shared/vermietung/vermietung.js";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import { resToJson } from "../lib/commons/replies.js";
import store from "../lib/vermietungen/vermietungenstore.js";
import { checkOrgateam } from "./checkAccessHandlers.js";
import { saveVermietungToShare, vermietungVertragToBuchhaltung } from "../lib/pdf/pdfGeneration.js";
import { filterUnbestaetigteFuerJedermann } from "../lib/vermietungen/vermietungenService.js";
const app = express();
async function standardHandler(req, res, vermietungen) {
    const user = req.user;
    resToJson(res, filterUnbestaetigteFuerJedermann(vermietungen, user));
}
function saveAndReply(req, res, vermietung) {
    resToJson(res, store.saveVermietung(vermietung, req.user));
}
app.get("/vermietungen/vergangene", (req, res) => {
    standardHandler(req, res, store.vergangene());
});
app.get("/vermietungen/zukuenftige", (req, res) => {
    standardHandler(req, res, store.zukuenftigeMitGestern());
});
app.get("/vermietungen/alle", (req, res) => {
    standardHandler(req, res, store.alle());
});
app.get("/vermietungen/:startYYYYMM/:endYYYYMM", (req, res) => {
    const start = DatumUhrzeit.forYYYYMM(req.params.startYYYYMM);
    const end = DatumUhrzeit.forYYYYMM(req.params.endYYYYMM);
    standardHandler(req, res, store.byDateRangeInAscendingOrder(start, end));
});
app.get("/vermietung/:url", (req, res) => {
    const vermietung = store.getVermietung(req.params.url);
    if (!vermietung) {
        res.sendStatus(404);
        return;
    }
    resToJson(res, vermietung);
});
app.post("/vermietung", [checkOrgateam], async (req, res, next) => {
    const vermSaved = store.getVermietung(req.body.url);
    const vermietung = new Vermietung(req.body);
    if (vermSaved) {
        const frischFreigegeben = vermSaved.angebot.freigabe !== vermietung.angebot.freigabe && !!vermietung.angebot.freigabe;
        if (frischFreigegeben) {
            try {
                await Promise.all([vermietungVertragToBuchhaltung(vermietung), saveVermietungToShare(vermietung)]);
            }
            catch {
                return next(new Error("Vermietungsvertrag Versand an Buchhaltung gescheitert"));
            }
        }
    }
    return saveAndReply(req, res, vermietung);
});
app.delete("/vermietung", [checkOrgateam], (req, res) => {
    store.deleteVermietungById(req.body.id, req.user);
    resToJson(res);
});
function addOrRemoveUserFromSection(func, req, res) {
    const vermietung = store.getVermietung(req.params.url);
    if (!vermietung) {
        return res.sendStatus(404);
    }
    vermietung.staff[func](req.user, req.body.section);
    saveAndReply(req, res, vermietung);
}
app.post("/vermietung/:url/addUserToSection", (req, res) => {
    addOrRemoveUserFromSection("addUserToSection", req, res);
});
app.post("/vermietung/:url/removeUserFromSection", (req, res) => {
    addOrRemoveUserFromSection("removeUserFromSection", req, res);
});
export default app;
