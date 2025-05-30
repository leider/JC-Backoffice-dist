import express from "express";
import OptionValues from "jc-shared/optionen/optionValues.js";
import Orte from "jc-shared/optionen/orte.js";
import FerienIcals from "jc-shared/optionen/ferienIcals.js";
import Termin from "jc-shared/optionen/termin.js";
import store from "../lib/optionen/optionenstore.js";
import terminstore from "../lib/optionen/terminstore.js";
import { resToJson } from "../lib/commons/replies.js";
import { calculateChangedAndDeleted } from "jc-shared/commons/compareObjects.js";
import misc from "jc-shared/commons/misc.js";
import { checkOrgateam } from "./checkAccessHandlers.js";
const app = express();
app.get("/optionen", (req, res) => {
    resToJson(res, store.get());
});
app.post("/optionen", [checkOrgateam], (req, res) => {
    store.save(req.body, req.user);
    resToJson(res, new OptionValues(req.body));
});
app.get("/orte", (req, res) => {
    resToJson(res, store.orte());
});
app.post("/orte", [checkOrgateam], (req, res) => {
    store.save(req.body, req.user);
    resToJson(res, new Orte(req.body));
});
app.get("/kalender", [checkOrgateam], (req, res) => {
    const icals = store.icals();
    resToJson(res, icals);
});
app.post("/kalender", [checkOrgateam], (req, res) => {
    store.save(req.body, req.user);
    resToJson(res, new FerienIcals(req.body));
});
app.get("/termine", (req, res) => {
    resToJson(res, terminstore.alle());
});
app.post("/termine", [checkOrgateam], (req, res) => {
    const oldTermine = terminstore.alle();
    const newTermine = misc.toObjectList(Termin, req.body);
    const { changed, deletedIds } = calculateChangedAndDeleted(newTermine, oldTermine);
    terminstore.saveAll(changed, req.user);
    terminstore.removeAll(deletedIds, req.user);
    resToJson(res, terminstore.alle());
});
export default app;
