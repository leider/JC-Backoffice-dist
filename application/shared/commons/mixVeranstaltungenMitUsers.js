import find from "lodash/find.js";
import map from "lodash/map.js";
import compact from "lodash/compact.js";
export default function mixVeranstaltungenMitUsers(veranstaltungen, users) {
    return veranstaltungen.flatMap((veranstaltung) => {
        const existingUsers = compact(map(veranstaltung.staff.allNames, (id) => find(users, { id })));
        return map(existingUsers, (user) => ({ veranstaltung, user }));
    });
}
