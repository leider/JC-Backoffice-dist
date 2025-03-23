import express from "express";
import mailstore from "../lib/mailsender/mailstore.js";
import MailRule from "jc-shared/mail/mailRule.js";
import { resToJson } from "../lib/commons/replies.js";
import mailtransport from "../lib/mailsender/mailtransport.js";
import userstore from "../lib/users/userstore.js";
import misc from "jc-shared/commons/misc.js";
import { calculateChangedAndDeleted } from "jc-shared/commons/compareObjects.js";
import { checkSuperuser } from "./checkAccessHandlers.js";
import fs from "fs/promises";
import parseFormData from "../lib/commons/parseFormData.js";
import MailMessage from "jc-shared/mail/mailMessage.js";
import map from "lodash/map.js";
import forEach from "lodash/forEach.js";
import filter from "lodash/filter.js";
const app = express();
app.get("/mailrule", [checkSuperuser], (req, res) => {
    resToJson(res, mailstore.all());
});
app.post("/mailrules", [checkSuperuser], (req, res) => {
    const oldRules = mailstore.all();
    const newRules = misc.toObjectList(MailRule, req.body);
    const { changed, deletedIds } = calculateChangedAndDeleted(newRules, oldRules);
    mailstore.saveAll(changed, req.user);
    mailstore.removeAll(deletedIds, req.user);
    resToJson(res, mailstore.all());
});
// Mailinglisten und Senden
app.post("/rundmail", [checkSuperuser], async (req, res) => {
    const { fields, files } = await parseFormData(req);
    const user = req.user;
    const message = MailMessage.forJsonAndUser(JSON.parse((fields.message ?? [])[0]), user);
    if (files.dateien) {
        message.attachments = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(files.dateien, async (datei) => {
            const content = await fs.readFile(datei.path);
            const filename = datei.originalFilename.replace(/[()/]/g, "_");
            return { filename, content };
        }));
    }
    const result = await mailtransport.sendMail(message);
    resToJson(res, result);
});
app.post("/mailinglisten", [checkSuperuser], (req, res) => {
    const users = userstore.allUsers();
    const updatedLists = req.body;
    forEach(users, (u) => (u.mailinglisten = []));
    forEach(updatedLists, (list) => {
        const selectedUsers = filter(users, (u) => list.users.includes(u.id));
        forEach(selectedUsers, (u) => u.subscribeList(list.name));
    });
    userstore.saveAll(users ?? [], req.user);
    resToJson(res, users);
});
app.get("/mailinglisten", [checkSuperuser], (req, res) => {
    const users = userstore.allUsers();
    resToJson(res, map(users, "withoutPass"));
});
export default app;
