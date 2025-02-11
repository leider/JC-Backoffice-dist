import express from "express";
import store from "./konzertestore.js";
import invokeMap from "lodash/invokeMap.js";
const app = express();
// this file is currently unused
// const fileexportStadtKarlsruhe = beans.get('fileexportStadtKarlsruhe');
function veranstaltungenForExport(fetcher, req, res) {
    if (!req.user.accessrights.isBookingTeam) {
        return res.redirect("/");
    }
    const veranstaltungen = fetcher();
    const lines = invokeMap(veranstaltungen, "toCSV");
    return res.type("csv").send(lines);
}
app.get("/zukuenftige/csv", (req, res) => {
    veranstaltungenForExport(store.zukuenftigeMitGestern, req, res);
});
app.get("/vergangene/csv", (req, res) => {
    veranstaltungenForExport(store.vergangene, req, res);
});
// app.get('/:url/fileexportStadtKarlsruhe', (req, res, next) => {
//   fileexportStadtKarlsruhe.send(req.params.url, (err, result) => {
//     if (err) { return next(err); }
//     res.send(result);
//   });
// });
export default app;
