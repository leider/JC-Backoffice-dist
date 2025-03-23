import express from "express";
import flatMap from "lodash/flatMap.js";
import DatumUhrzeit from "jc-shared/commons/DatumUhrzeit.js";
import store from "../lib/konzerte/konzertestore.js";
import optionenstore from "../lib/optionen/optionenstore.js";
import terminstore from "../lib/optionen/terminstore.js";
import vermietungenstore from "../lib/vermietungen/vermietungenstore.js";
import { resToJson } from "../lib/commons/replies.js";
import konzerteService from "../lib/konzerte/konzerteService.js";
import { filterUnbestaetigteFuerJedermann } from "../lib/vermietungen/vermietungenService.js";
import { icalToTerminEvents, parseIcal } from "jc-shared/commons/iCalendarUtils.js";
import kalenderEventsService from "../lib/optionen/kalenderEventsService.js";
import map from "lodash/map.js";
import filter from "lodash/filter.js";
import identity from "lodash/identity.js";
const app = express();
function asCalendarEvent(veranstaltung, user, darkMode) {
    return veranstaltung.asCalendarEvent(user.accessrights.isOrgaTeam, darkMode);
}
function eventsBetween(start, end, user, darkMode) {
    const konzerte = store.byDateRangeInAscendingOrder(start, end);
    const unbest = konzerteService.filterUnbestaetigteFuerJedermann(konzerte, user);
    return map(unbest, (ver) => asCalendarEvent(ver, user, darkMode));
}
function vermietungenBetween(start, end, user, darkMode) {
    const vermietungen = vermietungenstore.byDateRangeInAscendingOrder(start, end);
    return map(filterUnbestaetigteFuerJedermann(vermietungen, user), (ver) => asCalendarEvent(ver, user, darkMode));
}
async function termineForIcal(ical) {
    const result = await kalenderEventsService.retrieveEvents(ical);
    return result ? icalToTerminEvents(parseIcal(result)) : [];
}
function termineAsEventsBetween(start, end, options) {
    const termine = terminstore.termineBetween(start, end);
    let filteredTermine = termine;
    if (options) {
        filteredTermine = filter(termine, (termin) => options.termine?.includes(termin.typ));
    }
    return map(filteredTermine, "asEvent");
}
app.get("/fullcalendarevents.json", async (req, res) => {
    const start = DatumUhrzeit.forISOString(req.query.start);
    const end = DatumUhrzeit.forISOString(req.query.end);
    const options = req.query.options
        ? JSON.parse(req.query.options)
        : undefined;
    const darkMode = req.query.isDarkMode === "true";
    const cals = optionenstore.icals();
    const termine = termineAsEventsBetween(start, end, options);
    const konzerte = eventsBetween(start, end, req.user, darkMode);
    const vermietungen = vermietungenBetween(start, end, req.user, darkMode);
    const icals = filter(cals?.icals, (ical) => (options ? options.icals?.includes(ical.typ) : true));
    const termineForIcals = await Promise.all(map(icals, termineForIcal));
    const events = termine
        .concat(flatMap(termineForIcals, (identity)))
        .concat(konzerte)
        .concat(vermietungen);
    resToJson(res, events);
});
export default app;
