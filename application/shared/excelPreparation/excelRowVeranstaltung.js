import KonzertKalkulation from "../konzert/konzertKalkulation.js";
import map from "lodash/map.js";
import tinycolor from "tinycolor2";
function einnahme(betrag) {
    return betrag ?? 0;
}
function ausgabe(betrag) {
    return (betrag ?? -0) * -1;
}
function isSpende(name) {
    return ["spende", "spenden", "Spende", "Spenden"].includes(name);
}
function fillWerbung(row, kosten) {
    if (kosten.werbung1 && kosten.werbung1 !== 0) {
        row.werbung1 = ausgabe(kosten.werbung1);
        row.werbung1Text = kosten.werbung1Label;
    }
    if (kosten.werbung2 && kosten.werbung2 !== 0) {
        row.werbung2 = ausgabe(kosten.werbung2);
        row.werbung2Text = kosten.werbung2Label;
    }
    if (kosten.werbung3 && kosten.werbung3 !== 0) {
        row.werbung3 = ausgabe(kosten.werbung3);
        row.werbung3Text = kosten.werbung3Label;
    }
    if (kosten.werbung4 && kosten.werbung4 !== 0) {
        row.werbung4 = ausgabe(kosten.werbung4);
        row.werbung4Text = kosten.werbung4Label;
    }
    if (kosten.werbung5 && kosten.werbung5 !== 0) {
        row.werbung5 = ausgabe(kosten.werbung5);
        row.werbung5Text = kosten.werbung5Label;
    }
    if (kosten.werbung6 && kosten.werbung6 !== 0) {
        row.werbung6 = ausgabe(kosten.werbung6);
        row.werbung6Text = kosten.werbung6Label;
    }
    return row;
}
export function excelRows({ veranstaltungen, optionen, urlRoot, }) {
    const klavierStimmerDefault = optionen.preisKlavierstimmer;
    return map(veranstaltungen, (veranstaltung, index) => excelRowVeranstaltung({ veranstaltung, klavierStimmerDefault, urlRoot, index }));
}
function excelRowVeranstaltung({ veranstaltung, klavierStimmerDefault, urlRoot, index, }) {
    return veranstaltung.isVermietung ? excelRowVermietung(veranstaltung) : excelRowKonzert(veranstaltung);
    function excelRowKonzert(konzert) {
        const kasse = konzert.kasse;
        const kalk = new KonzertKalkulation(konzert);
        const kosten = konzert.kosten;
        const staff = konzert.staff;
        const klavierStimmerStandard = konzert.technik.fluegel ? klavierStimmerDefault : 0;
        const eintrittspreisSchnitt = konzert.eintrittspreise.eintrittspreisSchnitt;
        const result = {
            rowNo: index + 2,
            datum: konzert.startDatumUhrzeit.toJSDate,
            titel: konzert.kopf.titel,
            url: `${urlRoot}${konzert.fullyQualifiedUrl}`,
            typ: konzert.kopf.eventTypRich?.name ?? "",
            color: tinycolor(konzert.kopf.eventTypRich?.color ?? "#FFF").toHexString(),
            abendkasse: einnahme(kasse.einnahmeTicketsEUR),
            reservix: einnahme(kasse.einnahmenReservix),
            einnahmenBar: einnahme(kasse.einnahmeOhneBankUndTickets),
            ausgabenBar: ausgabe(kasse.ausgabenOhneGage),
            anBank: ausgabe(kasse.ausgabeBankEUR),
            gage: ausgabe(kosten.gagenTotalEUR),
            deal: ausgabe(kalk.dealAbsolutEUR),
            provision: ausgabe(kosten.provisionAgentur),
            technik: ausgabe(kosten.technikAngebot1EUR),
            fluegel: ausgabe(kosten.fluegelstimmerEUR || klavierStimmerStandard),
            saalmiete: ausgabe(kosten.saalmiete),
            personal: ausgabe(kosten.personal),
            tontechniker: !staff.technikerVNotNeeded && !kosten.tontechniker ? "N/A" : ausgabe(kosten.tontechniker),
            lichttechniker: !staff.technikerNotNeeded && !kosten.lichttechniker ? "N/A" : ausgabe(kosten.lichttechniker),
            cateringMusiker: ausgabe(kosten.cateringMusiker),
            hotel: ausgabe(konzert.unterkunft.roomsTotalEUR),
            hotelTransport: ausgabe(konzert.unterkunft.transportEUR),
            ksk: ausgabe(kosten.ksk),
            gema: ausgabe(kalk.gema),
            eintrittspreisSchnitt: einnahme(eintrittspreisSchnitt),
            anzahlReservix: einnahme(kasse.anzahlReservix || kasse.einnahmenReservix / (eintrittspreisSchnitt || 1)),
            anzahlBesucherAK: einnahme(kasse.anzahlBesucherAK),
            anzahlAbendkasse: einnahme(kasse.einnahmeTicketsEUR / (eintrittspreisSchnitt || 1)),
            kasseFreigegeben: kasse.istFreigegeben,
        };
        if (kasse.einnahmeSonstiges1EUR && kasse.einnahmeSonstiges1EUR !== 0) {
            if (isSpende(kasse.einnahmeSonstiges1Text)) {
                result.spende = kasse.einnahmeSonstiges1EUR;
            }
            else {
                result.einnahme1 = kasse.einnahmeSonstiges1EUR;
                result.einnahme1Text = kasse.einnahmeSonstiges1Text;
            }
        }
        if (kasse.einnahmeSonstiges2EUR && kasse.einnahmeSonstiges2EUR !== 0) {
            if (isSpende(kasse.einnahmeSonstiges2Text)) {
                result.spende = kasse.einnahmeSonstiges2EUR;
            }
            else {
                result.einnahme2 = kasse.einnahmeSonstiges2EUR;
                result.einnahme2Text = kasse.einnahmeSonstiges2Text;
            }
        }
        result.anzahlSpende = einnahme((result.spende ?? 0) / 10);
        return fillWerbung(result, kosten);
    }
    function excelRowVermietung(vermietung) {
        const kosten = vermietung.kosten;
        const klavierStimmerStandard = vermietung.technik.fluegel ? klavierStimmerDefault : 0;
        const result = {
            rowNo: index + 2,
            datum: vermietung.startDatumUhrzeit.toJSDate,
            titel: vermietung.kopf.titel,
            url: `${urlRoot}${vermietung.fullyQualifiedUrl}`,
            color: "#f6eee1",
            typ: "Vermietung",
            gage: ausgabe(kosten.gagenTotalEUR),
            technik: ausgabe(kosten.technikAngebot1EUR),
            fluegel: ausgabe(kosten.fluegelstimmerEUR || klavierStimmerStandard),
            saalmiete: einnahme(vermietung.saalmiete),
            personal: ausgabe(kosten.personal),
        };
        return fillWerbung(result, kosten);
    }
}
