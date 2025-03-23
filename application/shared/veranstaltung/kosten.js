import isString from "lodash/isString.js";
import keys from "lodash/keys.js";
function floatAmount(textWithNumberOrNull) {
    return parseFloat(textWithNumberOrNull || "") || 0;
}
function formatNumberTwoDigits(number) {
    if (isString(number)) {
        return number;
    }
    if (number !== 0 && !number) {
        return "";
    }
    return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
    }).format(number || 0);
}
class Kosten {
    constructor(object) {
        this.backlineEUR = 0;
        this.saalmiete = 0;
        this.technikAngebot1EUR = 0;
        this.fluegelstimmerEUR = 0;
        this.gagenEUR = 0;
        this.provisionAgentur = 0;
        this.werbung1 = 0;
        this.werbung2 = 0;
        this.werbung3 = 0;
        this.werbung4 = 0;
        this.werbung5 = 0;
        this.werbung6 = 0;
        this.werbung1Label = "Werbung 1";
        this.werbung2Label = "Werbung 2";
        this.werbung3Label = "Werbung 3";
        this.werbung4Label = "Werbung 4";
        this.werbung5Label = "Werbung 5";
        this.werbung6Label = "Werbung 6";
        this.personal = 0;
        this.gagenSteuer = null;
        this.deal = null;
        this.gageBAR = false;
        this.cateringMusiker = 0;
        this.cateringPersonal = 0;
        this.tontechniker = 0;
        this.lichttechniker = 0;
        if (object && keys(object).length) {
            Object.assign(this, object);
            if (!this.gagenSteuer) {
                this.gagenSteuer = "ohne";
            }
        }
    }
    get gagenTotalEUR() {
        const eur = this.gagenEUR;
        const mwst = (eur * floatAmount(this.gagenSteuer)) / 100;
        return eur + mwst;
    }
    get gagenTotalEURformatted() {
        return formatNumberTwoDigits(this.gagenTotalEUR);
    }
    get dealAlsFaktor() {
        return floatAmount(this.deal) / 100;
    }
    get backlineUndTechnikEUR() {
        return this.backlineEUR + this.technikAngebot1EUR + this.fluegelstimmerEUR;
    }
    get ksk() {
        return (this.gagenEUR ?? 0) * 0.05;
    }
    get totalEUR() {
        return (this.gagenTotalEUR +
            this.provisionAgentur +
            this.backlineUndTechnikEUR +
            this.saalmiete +
            this.werbung1 +
            this.werbung2 +
            this.werbung3 +
            this.personal +
            this.cateringPersonal +
            this.cateringMusiker +
            this.tontechniker +
            this.lichttechniker +
            this.ksk);
    }
}
Kosten.deals = ["ohne", "100%", "90%", "80%", "70%", "60%"];
export default Kosten;
