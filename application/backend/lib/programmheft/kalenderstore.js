import Kalender from "jc-shared/programmheft/kalender.js";
import pers from "../persistence/sqlitePersistence.js";
import misc from "jc-shared/commons/misc.js";
const persistence = pers("kalenderstore");
export default {
    alleKalender: function alleKalender() {
        const result = persistence.list("id DESC");
        return misc.toObjectList(Kalender, result);
    },
    getKalender: function getKalender(id) {
        return misc.toObject(Kalender, persistence.getById(id));
    },
    saveKalender: function saveKalender(kalender, user) {
        persistence.save(kalender, user);
        return kalender;
    },
    getCurrentKalender: function getCurrentKalender(aDatumUhrzeit) {
        return this.getKalender(aDatumUhrzeit.vorigerOderAktuellerUngeraderMonat.fuerKalenderViews);
    },
    getNextKalender: function getNextKalender(aDatumUhrzeit) {
        return this.getKalender(aDatumUhrzeit.naechsterUngeraderMonat.fuerKalenderViews);
    },
};
