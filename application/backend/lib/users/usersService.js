import { BOOKING, SUPERUSERS } from "jc-shared/user/user.js";
import store from "./userstore.js";
import { genSalt, hashPassword } from "../commons/hashPassword.js";
import filter from "lodash/filter.js";
import map from "lodash/map.js";
export default {
    saveNewUserWithPassword: function saveNewUserWithPassword(userToSave, user) {
        const password = userToSave.password;
        if (!password) {
            throw new Error("Kein Passwort übermittelt");
        }
        delete userToSave.password;
        const existingUser = store.forId(userToSave.id);
        if (existingUser) {
            throw new Error(`Benutzer mit Id '${userToSave.id}' existiert schon`);
        }
        const newSalt = genSalt();
        userToSave.salt = newSalt;
        userToSave.hashedPassword = hashPassword(password, newSalt);
        return store.save(userToSave, user);
    },
    changePassword: function changePassword(userToSave, user) {
        const password = userToSave.password;
        if (!password) {
            throw new Error("Kein Passwort übermittelt");
        }
        delete userToSave.password;
        const existingUser = store.forId(userToSave.id);
        if (!existingUser) {
            return null;
        }
        const newSalt = genSalt();
        existingUser.salt = newSalt;
        existingUser.hashedPassword = hashPassword(password, newSalt);
        return store.save(existingUser, user);
    },
    emailsAllerBookingUser: function emailsAllerBookingUser() {
        const users = store.allUsers();
        return map(filter(users, (user) => user.email && (user.gruppen?.includes(BOOKING) || user.gruppen?.includes(SUPERUSERS))), (u) => ({ name: u.name, address: u.email }));
    },
    emailsAllerAdmins: function emailsAllerAdmins() {
        const users = store.allUsers();
        return map(filter(users, (user) => user.email && user.gruppen?.includes(SUPERUSERS)), (u) => ({
            name: u.name,
            address: u.email,
        }));
    },
};
