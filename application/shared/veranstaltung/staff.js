import compact from "lodash/compact.js";
import flatten from "lodash/flatten.js";
import keys from "lodash/keys.js";
export default class Staff {
    constructor(object) {
        this.techniker = [];
        this.technikerV = [];
        this.merchandise = [];
        this.kasse = [];
        this.kasseV = [];
        this.mod = [];
        this.ersthelfer = [];
        this.technikerNotNeeded = true;
        this.technikerVNotNeeded = true;
        this.kasseNotNeeded = true;
        this.kasseVNotNeeded = true;
        this.modNotNeeded = true;
        this.merchandiseNotNeeded = true;
        this.ersthelferNotNeeded = false;
        if (object && keys(object).length) {
            Object.assign(this, object, {
                techniker: object.techniker || [],
                technikerV: object.technikerV || [],
                kasse: object.kasse || [],
                kasseV: object.kasseV || [],
                merchandise: object.merchandise || [],
                mod: object.mod || [],
                ersthelfer: object.ersthelfer || [],
            });
        }
    }
    getStaffCollection(forType) {
        return this[forType];
    }
    get noStaffNeeded() {
        return this.technikerNotNeeded && this.technikerVNotNeeded && this.kasseNotNeeded && this.kasseVNotNeeded && this.merchandiseNotNeeded;
    }
    get noOfRowsNeeded() {
        if (this.noStaffNeeded) {
            return 0;
        }
        return ((this.technikerNotNeeded ? 0 : 1) +
            (this.technikerVNotNeeded ? 0 : 1) +
            (this.kasseNotNeeded ? 0 : 1) +
            (this.kasseVNotNeeded ? 0 : 1) +
            (this.modNotNeeded ? 0 : 1) +
            (this.ersthelferNotNeeded ? 0 : 1));
    }
    get tooltipInfos() {
        if (this.noStaffNeeded) {
            return "";
        }
        const kasseAlle = this.kasseV.concat(this.kasse);
        const kassiererText = kasseAlle.length > 0 ? kasseAlle.join(", ") : "-";
        const technikerAlle = this.technikerV.concat(this.techniker);
        const technikerText = technikerAlle.length > 0 ? technikerAlle.join(", ") : "-";
        return " Kasse: " + kassiererText + " | Techniker: " + technikerText;
    }
    get kasseFehlt() {
        return (!this.kasseNotNeeded && this.kasse.length === 0) || (!this.kasseVNotNeeded && this.kasseV.length === 0);
    }
    get masterFehlt() {
        return !this.modNotNeeded && this.mod.length === 0;
    }
    addUserToSection(user, section) {
        this.getStaffCollection(section).push(user.id);
    }
    removeUserFromSection(user, section) {
        const sec = this.getStaffCollection(section);
        const index = sec.indexOf(user.id);
        sec.splice(index, 1);
    }
    get allNames() {
        return compact(flatten([this.kasseV, this.kasse, this.technikerV, this.techniker, this.mod]));
    }
}
