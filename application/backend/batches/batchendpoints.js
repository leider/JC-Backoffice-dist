import express from "express";
import { loggers } from "winston";
import path from "node:path";
import { db } from "../lib/persistence/sqlitePersistence.js";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import { loadRulesAndProcess } from "./sendMailsForRules.js";
import { checkFluegel, checkFotograf } from "./sendMailsNightlyPhotoAndFluegel.js";
import { checkPressetexte } from "./sendMailsPressetextFehlt.js";
import { checkKasse } from "./sendMailsKasseFehlt.js";
import { remindForProgrammheft } from "./sendMailsForProgrammheft.js";
import { checkStaff } from "./sendMailsStaffReminder.js";
import { checkBar } from "./sendMailsNightlyBar.js";
import { informAdmin } from "./sendMailToAdmin.js";
import map from "lodash/map.js";
import { checkMaster } from "./sendMailsMasterFehlt.js";
const logger = loggers.get("application");
const app = express();
async function backupDatabase(targetDir) {
    const outfile = path.join(`${targetDir ?? ""}`, `backup-JC-sqlite-${new Date().toJSON()}.db`);
    await db.backup(outfile);
    const zip = new AdmZip();
    zip.addLocalFile(outfile);
    await zip.writeZipPromise(outfile.replace(".db", ".zip"));
    return fs.rm(outfile);
}
async function nightlyMails() {
    const now = new DatumUhrzeit();
    const results = await Promise.all([
        loadRulesAndProcess(now),
        checkFluegel(now),
        checkFotograf(now),
        checkPressetexte(now),
        checkKasse(now),
        remindForProgrammheft(now),
        checkStaff(now),
        checkBar(now),
        checkMaster(now),
    ]);
    const jobtypes = ["Presse", "Fluegel", "Photo", "TextFehlt", "Kasse", "Programmheft", "Staff", "Bar", "Master"];
    const typedResults = map(results, (jobResult, index) => ({ type: jobtypes[index], jobResult }));
    return informAdmin(typedResults);
}
app.get("/nightly-mails", async (req, res) => {
    try {
        await nightlyMails();
        res.jsonp({ status: "Success" });
    }
    catch (err) {
        logger.error(err);
        res.status(500).jsonp({ status: "Error", error: err, message: err.message });
    }
});
app.get("/backup-database", async (req, res) => {
    const { path } = req.query;
    try {
        await backupDatabase(path);
        res.jsonp({ status: "Success" });
    }
    catch (err) {
        logger.error(err);
        res.status(500).jsonp({ status: "Error", error: err, message: err.message });
    }
});
export default app;
