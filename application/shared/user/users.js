import { SUPERUSERS } from "./user.js";
import misc from "../commons/misc.js";
import uniq from "lodash/uniq.js";
import map from "lodash/map.js";
import filter from "lodash/filter.js";
import flatMap from "lodash/flatMap.js";
export class Mailingliste {
    constructor(name, usersInListe) {
        this.name = name;
        this.users = map(usersInListe, "id");
    }
}
class Users {
    constructor(users) {
        this.users = [];
        this.users = users;
    }
    filterReceivers(groupsFromBody, userFromBody, listenFromBody) {
        let result = [];
        if (groupsFromBody && groupsFromBody.length) {
            if (misc.toArray(groupsFromBody).includes("alle")) {
                return this.users;
            }
            result = result.concat(uniq(flatMap(misc.toArray(groupsFromBody).concat(SUPERUSERS), (group) => filter(this.users, (user) => user.gruppen.includes(group)))));
        }
        if (listenFromBody && listenFromBody.length) {
            result = result.concat(uniq(flatMap(misc.toArray(listenFromBody), (liste) => this.getUsersInListe(liste))));
        }
        return uniq(result.concat(filter(this.users, (user) => (userFromBody || []).includes(user.id))));
    }
    extractListen() {
        return uniq(flatMap(this.users, (u) => u.mailinglisten));
    }
    getUsersInListe(listenname) {
        return filter(this.users, (u) => u.mailinglisten.includes(listenname));
    }
    getUsersInGruppenExact(gruppennamen) {
        return filter(this.users, (user) => {
            return gruppennamen?.includes(user.gruppen);
        });
    }
    getUsersKann(kann) {
        return filter(this.users, (u) => u.kann(kann));
    }
    getUsersKannOneOf(kannMultiple) {
        return filter(this.users, (user) => filter(kannMultiple, (kann) => user.kann(kann)).length > 0);
    }
    get mailinglisten() {
        return map(this.extractListen(), (name) => new Mailingliste(name, this.getUsersInListe(name)));
    }
}
export default Users;
