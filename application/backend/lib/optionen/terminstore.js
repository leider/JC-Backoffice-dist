import Termin from "jc-shared/optionen/termin.js";
import pers from "../persistence/sqlitePersistence.js";
import misc from "jc-shared/commons/misc.js";
const persistence = pers("terminstore", ["startDate", "endDate"]);
function byDateRange(rangeFrom, rangeTo, sortOrder) {
    const result = persistence.listByField(`startDate < '${rangeTo.toISOString}' AND endDate > '${rangeFrom.toISOString}'`, `startDate ${sortOrder}`);
    return misc.toObjectList(Termin, result);
}
export default {
    alle: function alle() {
        const result = persistence.list("startDate DESC");
        return misc.toObjectList(Termin, result);
    },
    save: function save(termin, user) {
        persistence.save(termin, user);
        return termin;
    },
    saveAll: function saveAll(termine, user) {
        persistence.saveAll(termine, user);
        return termine;
    },
    termineBetween: function termineBetween(rangeFrom, rangeTo) {
        return byDateRange(rangeFrom, rangeTo, "DESC");
    },
    remove: function remove(id, user) {
        persistence.removeById(id, user);
    },
    removeAll: function removeAll(ids, user) {
        persistence.removeAllByIds(ids, user);
    },
};
