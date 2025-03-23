import User, { ABENDKASSE, BOOKING, ORGA, SUPERUSERS } from "./user.js";
export default class Accessrights {
    constructor(user) {
        this.user = user ?? new User({});
    }
    get member() {
        return this.user;
    }
    get memberId() {
        return this.member.id || "";
    }
    get gruppen() {
        return this.member.gruppen ?? "";
    }
    get rechte() {
        return this.member.rechte;
    }
    get isSuperuser() {
        return this.gruppen === SUPERUSERS;
    }
    get isBookingTeam() {
        return this.isSuperuser || this.gruppen === BOOKING;
    }
    get isOrgaTeam() {
        return this.isBookingTeam || this.gruppen === ORGA;
    }
    get isAbendkasse() {
        return this.isOrgaTeam || this.gruppen === ABENDKASSE;
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
