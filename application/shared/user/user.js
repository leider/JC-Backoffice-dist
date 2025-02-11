import Accessrights from "./accessrights.js";
import isNil from "lodash/isNil.js";
export const SUPERUSERS = "superusers";
export const BOOKING = "bookingTeam";
export const ORGA = "orgaTeam";
export const ABENDKASSE = "abendkasse";
export const userGruppen = [SUPERUSERS, BOOKING, ORGA, ABENDKASSE];
export default class User {
    constructor(object) {
        this.gruppen = "";
        this.rechte = [];
        this.kassenfreigabe = false;
        this.mailinglisten = [];
        delete this.accessrightsTransient;
        this.id = object.id;
        Object.assign(this, object, {
            kassenfreigabe: object.kassenfreigabe || object.rechte?.includes("kassenfreigabe"),
            gruppen: Array.isArray(object.gruppen) ? object.gruppen[0] : object.gruppen,
        });
    }
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any*/
    toJSON() {
        const result = Object.assign({}, this);
        delete result.accessrightsTransient;
        return result;
    }
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any*/
    toJSONWithoutPass() {
        const result = this.toJSON();
        delete result.hashedPassword;
        delete result.salt;
        return result;
    }
    get asGitAuthor() {
        return `${this.name} <${this.email}>`;
    }
    subscribeList(listname) {
        this.mailinglisten.push(listname);
    }
    get hatKeineKannsGefuellt() {
        return isNil(this.kannKasse) && isNil(this.kannTon) && isNil(this.kannLicht) && isNil(this.kannMaster);
    }
    get kannSections() {
        const result = [];
        if (this.kannKasse) {
            result.push("Kasse");
        }
        if (this.kannTon) {
            result.push("Ton");
        }
        if (this.kannLicht) {
            result.push("Licht");
        }
        if (this.kannMaster) {
            result.push("Master");
        }
        if (this.kannErsthelfer) {
            result.push("Ersthelfer");
        }
        return result;
    }
    kann(kann) {
        switch (kann) {
            case "Kasse":
                return !!this.kannKasse;
            case "Licht":
                return !!this.kannLicht;
            case "Ton":
                return !!this.kannTon;
            case "Master":
                return !!this.kannMaster;
            case "Ersthelfer":
                return !!this.kannErsthelfer;
        }
    }
    get accessrights() {
        if (!this.accessrightsTransient) {
            this.accessrightsTransient = new Accessrights(this);
        }
        return this.accessrightsTransient;
    }
    get asUserAsOption() {
        return { label: this.name, value: this.id, kann: this.kannSections };
    }
}
