import KonzertKalkulation from "../konzert/konzertKalkulation.js";
import map from "lodash/map.js";
import forEach from "lodash/forEach.js";
import keys from "lodash/keys.js";
import { unifySpende } from "./excelFormatters.js";
import isString from "lodash/isString.js";
export function prepareExcel({ veranstaltungen, optionen }) {
    const klavierStimmerDefault = optionen.preisKlavierstimmer;
    const kumuliert = veranstaltungen.reduce((bestehende, ver) => {
        const kennzahlen = ver.isVermietung
            ? kennzahlenFuerVermietung(ver, klavierStimmerDefault)
            : kennzahlenFuerKonzert(ver, klavierStimmerDefault);
        integrateKennzahlen(kennzahlen, bestehende);
        return bestehende;
    }, {});
    // const werbung1Row =createRow(  kosten.werbung1Label, Einnahme: "", Ausgabe: kosten.werbung1 || 0 };
    // const werbung2Row = createRow( kosten.werbung2Label, Einnahme: "", Ausgabe: kosten.werbung2 || 0 };
    // const werbung3Row = createRow( kosten.werbung3Label, Einnahme: "", Ausgabe: kosten.werbung3 || 0 };
    const rows = [
        createRow("Eintritt Abendkasse Bar", kumuliert),
        createRow("Einnahmen Reservix", kumuliert),
        createRow("Bar Einnahmen", kumuliert),
        createRow("Bar Einlage", kumuliert),
        createRow("Zuschüsse", kumuliert),
        createRow("Saalmiete", kumuliert),
        createRow("Barausgaben", kumuliert),
        createRow("Bar an Bank", kumuliert),
        createRow("Gagen", kumuliert),
        createRow("Gagen (Deal)", kumuliert),
        createRow("Provision Agentur", kumuliert),
        createRow("Backline Rockshop", kumuliert),
        createRow("Technik Zumietung", kumuliert),
        createRow("Flügelstimmer", kumuliert),
        createRow("Saalmiete (extern)", kumuliert),
        createRow("Personal", kumuliert),
        createRow("Hotel", kumuliert),
        createRow("Hotel (Transport)", kumuliert),
    ];
    const kumulierte = map(keys(kumuliert), (key) => createRow(key, kumuliert));
    const keyNumberStrings = rows.concat(kumulierte);
    return keyNumberStrings;
}
function createRow(art, kumuliert) {
    const row = { Art: art, Summe: 0 };
    const element = kumuliert[art];
    row.Summe = element
        ? keys(element).reduce((sum, key) => {
            const strOrNum = element[key];
            row[key] = strOrNum;
            if (isString(strOrNum)) {
                return sum;
            }
            return sum + strOrNum;
        }, 0)
        : 0;
    delete kumuliert[art];
    return row;
}
function integrateKennzahlen(kennzahlen, bestehende) {
    forEach(keys(kennzahlen.kennzahlen), (key) => {
        if (!bestehende[key]) {
            bestehende[key] = {};
        }
        bestehende[key][kennzahlen.name] = kennzahlen.kennzahlen[key];
    });
}
function einnahme(betrag) {
    return betrag ?? 0;
}
function ausgabe(betrag) {
    return (betrag ?? -0) * -1;
}
function kennzahlenFuerKonzert(konzert, klavierStimmerDefault) {
    const kasse = konzert.kasse;
    const kalk = new KonzertKalkulation(konzert);
    const kosten = konzert.kosten;
    const staff = konzert.staff;
    const klavierStimmerStandard = konzert.technik.fluegel ? klavierStimmerDefault : 0;
    const result = {
        "Eintritt Abendkasse Bar": einnahme(kasse.einnahmeTicketsEUR),
        "Einnahmen Reservix": einnahme(kasse.einnahmenReservix),
        "Bar Einnahmen": einnahme(kasse.einnahmeOhneBankUndTickets),
        "Bar Einlage": einnahme(kasse.einnahmeBankEUR),
        Zuschüsse: einnahme(konzert.eintrittspreise.zuschuss),
        Barausgaben: ausgabe(kasse.ausgabenOhneGage),
        "Bar an Bank": ausgabe(kasse.ausgabeBankEUR),
        Gagen: ausgabe(kosten.gagenTotalEUR),
        "Gagen (Deal)": ausgabe(kalk.dealAbsolutEUR),
        "Provision Agentur": ausgabe(kosten.provisionAgentur),
        "Backline Rockshop": ausgabe(kosten.backlineEUR),
        "Technik Zumietung": ausgabe(kosten.technikAngebot1EUR),
        Flügelstimmer: ausgabe(kosten.fluegelstimmerEUR || klavierStimmerStandard),
        "Saalmiete (extern)": ausgabe(kosten.saalmiete),
        Personal: ausgabe(kosten.personal),
        Tontechniker: !staff.technikerVNotNeeded && !kosten.tontechniker ? "N/A" : ausgabe(kosten.tontechniker),
        Lichttechniker: !staff.technikerNotNeeded && !kosten.lichttechniker ? "N/A" : ausgabe(kosten.lichttechniker),
        "Catering Musiker": ausgabe(kosten.cateringMusiker),
        "Catering Personal": ausgabe(kosten.cateringPersonal),
        Hotel: ausgabe(konzert.unterkunft.roomsTotalEUR),
        "Hotel (Transport)": ausgabe(konzert.unterkunft.transportEUR),
        KSK: ausgabe(kosten.ksk),
        GEMA: ausgabe(kalk.gema),
    };
    if (kasse.einnahmeSonstiges1EUR && kasse.einnahmeSonstiges1EUR !== 0) {
        result[unifySpende(kasse.einnahmeSonstiges1Text) ?? "Einnahme Sonstiges 1"] = einnahme(kasse.einnahmeSonstiges1EUR);
    }
    if (kasse.einnahmeSonstiges2EUR && kasse.einnahmeSonstiges2EUR !== 0) {
        result[unifySpende(kasse.einnahmeSonstiges2Text) ?? "Einnahme Sonstiges 2"] = einnahme(kasse.einnahmeSonstiges2EUR);
    }
    for (let i = 1; i < 7; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kostenAny = kosten;
        if (kostenAny[`werbung${i}`] && kostenAny[`werbung${i}`] !== 0) {
            result[kostenAny[`werbung${i}Label`]] = ausgabe(kostenAny[`werbung${i}`]);
        }
    }
    return { kennzahlen: result, name: `${konzert.startDatumUhrzeit.mitUhrzeitNumerisch}/${konzert.kopf.titel}` };
}
function kennzahlenFuerVermietung(vermietung, klavierStimmerDefault) {
    const kosten = vermietung.kosten;
    const klavierStimmerStandard = vermietung.technik.fluegel ? klavierStimmerDefault : 0;
    const result = {
        Gagen: ausgabe(kosten.gagenTotalEUR),
        "Backline Rockshop": ausgabe(kosten.backlineEUR),
        "Technik Zumietung": ausgabe(kosten.technikAngebot1EUR),
        Flügelstimmer: ausgabe(kosten.fluegelstimmerEUR || klavierStimmerStandard),
        Saalmiete: einnahme(vermietung.saalmiete),
        Personal: ausgabe(kosten.personal),
    };
    for (let i = 1; i < 7; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kostenAny = kosten;
        if (kostenAny[`werbung${i}`] && kostenAny[`werbung${i}`] !== 0) {
            result[kostenAny[`werbung${i}Label`]] = ausgabe(kostenAny[`werbung${i}`]);
        }
    }
    return { kennzahlen: result, name: `${vermietung.startDatumUhrzeit.mitUhrzeitNumerisch}/${vermietung.kopf.titel}` };
}
