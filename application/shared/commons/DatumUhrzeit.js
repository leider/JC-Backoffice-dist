import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import "dayjs/locale/de.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import conf from "./simpleConfigure.js";
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.locale("de");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Berlin");
export default class DatumUhrzeit {
    constructor(dateTime) {
        this.val = dateTime && dateTime.isValid() ? dateTime : dayjs(conf.nowForDevelopment);
    }
    // Konstruktoren
    static forYYMM(YYMM) {
        return new DatumUhrzeit(dayjs(YYMM, "YYMM"));
    }
    static forYYYYMM(YYYYMM) {
        return new DatumUhrzeit(dayjs(YYYYMM, "YYYYMM"));
    }
    static forYYYYslashMM(YYYYMM) {
        return new DatumUhrzeit(dayjs(YYYYMM, "YYYY/MM"));
    }
    static forMonatLangJahrKompakt(MMM_apostrophYY) {
        return new DatumUhrzeit(dayjs(MMM_apostrophYY, "MMMM 'YY"));
    }
    static forISOString(ISO) {
        return new DatumUhrzeit(dayjs(ISO));
    }
    static forJSDate(jsDate) {
        return new DatumUhrzeit(dayjs(jsDate));
    }
    static forGermanString(dateString, timeString) {
        if (dateString) {
            return new DatumUhrzeit(dayjs(dateString + " " + (timeString || "00:00"), ["DD.MM.YYYY[ ]HH:mm", "DD.MM.YY[ ]HH:mm"]));
        }
        return null;
    }
    static forGermanStringOrNow(dateString, timeString) {
        if (dateString) {
            return new DatumUhrzeit(dayjs(dateString + " " + (timeString || "00:00"), ["DD.MM.YYYY[ ]HH:mm", "DD.MM.YY[ ]HH:mm"]));
        }
        return new DatumUhrzeit();
    }
    // Rechnen
    plus(options) {
        const d = this.value
            .add(options.jahre || 0, "y")
            .add(options.monate || 0, "M")
            .add(options.wochen || 0, "w")
            .add(options.tage || 0, "d")
            .add(options.stunden || 0, "h")
            .add(options.minuten || 0, "m");
        return new DatumUhrzeit(d);
    }
    minus(options) {
        const d = this.value
            .subtract(options.jahre || 0, "y")
            .subtract(options.monate || 0, "M")
            .subtract(options.wochen || 0, "w")
            .subtract(options.tage || 0, "d")
            .subtract(options.stunden || 0, "h")
            .subtract(options.minuten || 0, "m");
        return new DatumUhrzeit(d);
    }
    differenzInTagen(other) {
        return Math.trunc(this.value.diff(other.value, "day"));
    }
    differenzInMonaten(other) {
        return Math.trunc(this.value.diff(other.value, "month"));
    }
    moveByDifferenceDays(newDate) {
        const diff = new DatumUhrzeit(newDate).setUhrzeit(8, 0).differenzInTagen(this.setUhrzeit(8, 0));
        return this.plus({ tage: diff }).value;
    }
    // Vergleiche
    istVor(other) {
        return this.value < other.value;
    }
    istVorOderAn(other) {
        return this.value.isSameOrBefore(other.value);
    }
    istNach(other) {
        return this.value.isAfter(other.value);
    }
    // getter
    get monat() {
        return this.value.month() + 1;
    }
    get jahr() {
        return this.value.year();
    }
    get tag() {
        return this.value.date();
    }
    get kw() {
        return this.value.isoWeek();
    }
    get wochentag() {
        return this.value.day();
    }
    // pseudosetter
    setTag(tag) {
        return new DatumUhrzeit(this.value.date(tag));
    }
    setUhrzeit(stunde, minuten) {
        return new DatumUhrzeit(this.value.hour(stunde).minute(minuten));
    }
    // Formatierungen
    get yyyyMM() {
        return this.format("YYYYMM");
    }
    get monatLang() {
        return this.format("MMMM");
    }
    get monatKompakt() {
        return this.format("MMM");
    }
    get wochentagTagMonat() {
        return this.format("ddd DD. MMMM");
    }
    get wochentagTagMonatShort() {
        return this.format("ddd DD. MMM");
    }
    get tagMonatJahrKompakt() {
        return this.format("DD.MM.YYYY");
    }
    get uhrzeitKompakt() {
        return this.format("LT");
    }
    get wochentagUhrzeitKompakt() {
        return this.format("dd. LT");
    }
    get tagMonatJahrLang() {
        return this.format("LL");
    }
    get tagMonatJahrLangMitKW() {
        return this.format("LL [(KW ]ww[)]");
    }
    get lesbareLangform() {
        return this.format("LLLL");
    }
    get lesbareKurzform() {
        return this.format("llll");
    }
    get monatJahrKompakt() {
        return this.format("MMM[ ']YY");
    }
    get monatLangJahrKompakt() {
        return this.format("MMMM") + " '" + this.format("YY");
    }
    get fuerKalenderViews() {
        return this.format("YYYY/MM");
    }
    get fuerCalendarWidget() {
        return this.format("YYYY-MM-DD");
    }
    get fuerCsvExport() {
        return `${this.format("YYYY-MM-DD")}T${this.format("HH:mm")}`;
    }
    get tagNumerisch() {
        return this.format("Do");
    }
    get mitUhrzeitNumerisch() {
        return this.format("DD.MM.YY HH:mm");
    }
    get fuerUnterseiten() {
        return this.format("YYMM");
    }
    get fuerPresse() {
        return this.format("dddd, LL [um] HH:mm");
    }
    get fuerIcal() {
        return this.value.utc().format("YYYYMMDD[T]HHmmss[Z]");
    }
    format(options) {
        return this.value.format(options);
    }
    get toLocalDateTimeString() {
        return this.format("DD.MM.YYYY[,] HH:mm:ss");
    }
    get toISOString() {
        return this.value.toISOString();
    }
    get monatTag() {
        return this.value.format("MM-DD");
    }
    get toJSDate() {
        return this.value.toDate();
    }
    // special
    get vorigerOderAktuellerUngeraderMonat() {
        return this.minus({ monate: this.istGeraderMonat ? 1 : 0 });
    }
    get naechsterUngeraderMonat() {
        return this.plus({ monate: this.istGeraderMonat ? 1 : 2 });
    }
    get istGeraderMonat() {
        return this.monat % 2 === 0;
    }
    get value() {
        return this.val;
    }
}
