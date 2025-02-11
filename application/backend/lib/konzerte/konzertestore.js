import winston from "winston";
import Konzert from "jc-shared/konzert/konzert.js";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import pers from "../persistence/sqlitePersistence.js";
import misc from "jc-shared/commons/misc.js";
const persistence = pers("veranstaltungenstore", ["startDate", "endDate", "url"]);
const logger = winston.loggers.get("transactions");
function byDateRange(rangeFrom, rangeTo, sortOrder) {
    const result = persistence.listByField(`startDate < '${rangeTo.toISOString}' AND endDate > '${rangeFrom.toISOString}'`, `startDate ${sortOrder}`);
    return misc.toObjectList(Konzert, result);
}
function byDateRangeInAscendingOrder(rangeFrom, rangeTo) {
    return byDateRange(rangeFrom, rangeTo, "ASC");
}
function byDateRangeInDescendingOrder(rangeFrom, rangeTo) {
    return byDateRange(rangeFrom, rangeTo, "DESC");
}
export default {
    zukuenftigeMitGestern: function zukuenftigeMitGestern() {
        const now = new DatumUhrzeit();
        return byDateRangeInAscendingOrder(now.minus({ tage: 1 }), now.plus({ jahre: 10 }));
    },
    zukuenftige: function zukuenftige() {
        const now = new DatumUhrzeit();
        return byDateRangeInAscendingOrder(now, now.plus({ jahre: 10 }));
    },
    vergangene: function vergangene() {
        const now = new DatumUhrzeit();
        return byDateRangeInDescendingOrder(now.minus({ monate: 24 }), now);
    },
    alle: function alle() {
        const now = new DatumUhrzeit();
        return byDateRangeInDescendingOrder(now.minus({ jahre: 20 }), now.plus({ jahre: 10 }));
    },
    byDateRangeInAscendingOrder,
    getKonzert(url) {
        const result = persistence.getByField({ key: "url", val: url });
        return misc.toObject(Konzert, result);
    },
    getKonzertForId(id) {
        const result = persistence.getById(id);
        return misc.toObject(Konzert, result);
    },
    saveKonzert(konzert, user) {
        const object = konzert.toJSON();
        persistence.save(object, user);
        return konzert;
    },
    deleteKonzertById(id, user) {
        persistence.removeById(id, user);
        logger.info(`Konzert removed: ${JSON.stringify(id)}`);
        return;
    },
};
