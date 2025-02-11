import { ABENDKASSE, BOOKING, ORGA, SUPERUSERS } from "./user.js";
export default class Accessrights {
    constructor(user) {
        this.user = user;
    }
    get member() {
        return this.user;
    }
    get memberId() {
        return this.member?.id || "";
    }
    get gruppen() {
        return [this.member?.gruppen ?? ""];
    }
    get rechte() {
        return this.member?.rechte || [];
    }
    get isSuperuser() {
        return this.gruppen.includes(SUPERUSERS);
    }
    get isBookingTeam() {
        return this.isSuperuser || this.gruppen.includes(BOOKING);
    }
    get isOrgaTeam() {
        return this.isBookingTeam || this.gruppen.includes(ORGA);
    }
    get isAbendkasse() {
        return this.isOrgaTeam || this.gruppen.includes(ABENDKASSE);
    }
    get darfKasseFreigeben() {
        return this.isSuperuser || this.rechte.includes("kassenfreigabe");
    }
    // eslint-disable-next-line lodash/prefer-constant
    get everybody() {
        return true;
    }
    canEditUser(userid) {
        return this.isSuperuser || this.memberId === userid;
    }
}
