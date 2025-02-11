import fs from "fs/promises";
import store from "./konzertestore.js";
import conf from "jc-shared/commons/simpleConfigure.js";
import map from "lodash/map.js";
async function renameImage(oldname, newname, konzertIds, user) {
    function updateKonzert(id) {
        const konzert = store.getKonzertForId(id);
        if (!konzert) {
            return;
        }
        konzert.updateImageName(oldname, newname);
        return store.saveKonzert(konzert, user);
    }
    await fs.rename(conf.uploadDir + "/" + oldname, conf.uploadDir + "/" + newname);
    return Promise.all(map(konzertIds, updateKonzert));
}
function renameImages(rows, user) {
    function renameRow(row) {
        return renameImage(row.image, row.newname, map(row.veranstaltungen, "id"), user);
    }
    return Promise.all(map(rows, renameRow));
}
export default {
    renameImages,
    alleBildNamen: async function alleBildNamen() {
        const files = await fs.readdir(conf.uploadDir);
        return files.sort();
    },
};
