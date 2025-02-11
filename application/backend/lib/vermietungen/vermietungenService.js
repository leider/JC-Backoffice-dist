import filter from "lodash/filter.js";
/*
 * Alle unbestätigten und ohne Personal filtern
 */
export function filterUnbestaetigteFuerJedermann(vermietungen, user) {
    if (user.accessrights.isBookingTeam) {
        return vermietungen;
    }
    return filter(vermietungen, { kopf: { confirmed: true }, brauchtPersonal: true }); //  (v) => v.kopf.confirmed && v.brauchtPersonal
}
