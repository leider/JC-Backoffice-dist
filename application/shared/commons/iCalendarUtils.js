import { Parser } from "ikalendar";
import isString from "lodash/isString.js";
import map from "lodash/map.js";
export function parseIcal(text) {
    // workaround for cals having a field named TEXT like https://www.ferienwiki.de/exports/ferien/2020/de/baden-wuerttemberg
    const workaround = text.replace("NAME:", "COMMENT:");
    return new Parser().parse(workaround);
}
export function icalToTerminEvents(ical) {
    function toIsoString(event) {
        if (!event) {
            return "";
        }
        if (isString(event)) {
            return event;
        }
        return toIsoString(event.value);
    }
    return map(ical.events, (event) => ({
        backgroundColor: ical.color,
        borderColor: ical.color,
        display: "block",
        start: toIsoString(event.start),
        end: toIsoString(event.end || event.start),
        title: event.summary || "",
        tooltip: event.summary || "",
    }));
}
