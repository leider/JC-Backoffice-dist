export default class KonzertKalkulation {
    constructor(veranstaltung) {
        this.veranstaltung = veranstaltung;
    }
    get kasse() {
        return this.veranstaltung.kasse;
    }
    get kosten() {
        return this.veranstaltung.kosten;
    }
    get unterkunft() {
        return this.veranstaltung.unterkunft;
    }
    get eintrittspreise() {
        return this.veranstaltung.eintrittspreise;
    }
    get gema() {
        return this.erwarteterOderEchterEintritt * 0.05;
    }
    get kostenGesamtEUR() {
        const hotelkosten = this.veranstaltung.artist.brauchtHotel ? this.unterkunft.kostenTotalEUR : 0;
        return this.kosten.totalEUR + hotelkosten + this.kasse.ausgabenOhneGage + this.gema;
    }
    get erwarteterOderEchterEintritt() {
        return ((this.kasse.istFreigegeben ? this.kasse.einnahmeTicketsEUR : this.eintrittspreise.erwarteterEintritt) + this.kasse.einnahmenReservix);
    }
    get einnahmenGesamtEUR() {
        return this.erwarteterOderEchterEintritt;
    }
    get dealAbsolutEUR() {
        return Math.max(this.bruttoUeberschussEUR * this.kosten.dealAlsFaktor, 0);
    }
    get bruttoUeberschussEUR() {
        return this.einnahmenGesamtEUR - this.kostenGesamtEUR;
    }
    get dealUeberschussTotal() {
        return this.bruttoUeberschussEUR - this.dealAbsolutEUR;
    }
}
