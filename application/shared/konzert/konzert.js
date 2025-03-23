import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import Eintrittspreise from "./eintrittspreise.js";
import Kasse from "./kasse.js";
import Kontakt from "../veranstaltung/kontakt.js";
import Unterkunft from "./unterkunft.js";
import Vertrag from "./vertrag.js";
import Veranstaltung from "../veranstaltung/veranstaltung.js";
import filter from "lodash/filter.js";
export default class Konzert extends Veranstaltung {
    constructor(object) {
        super(object);
        this.changelist = undefined;
        this.gaesteliste = [];
        this.reservierungen = [];
        this.agentur = new Kontakt();
        this.eintrittspreise = new Eintrittspreise();
        this.hotel = new Kontakt();
        this.kasse = new Kasse();
        this.vertrag = new Vertrag();
        if (object) {
            Object.assign(this, {
                agentur: new Kontakt(object.agentur),
                eintrittspreise: new Eintrittspreise(object.eintrittspreise),
                hotel: new Kontakt(object.hotel),
                kasse: new Kasse(object.kasse),
                vertrag: new Vertrag(object.vertrag),
                changelist: object.changelist || [],
                gaesteliste: object.gaesteliste || [],
                reservierungen: object.reservierungen || [],
            });
            this.unterkunft = new Unterkunft(object.unterkunft, this.startDatumUhrzeit, this.artist.name);
        }
        else {
            this.unterkunft = new Unterkunft(undefined, this.startDatumUhrzeit, this.artist.name);
        }
    }
    asNew(object) {
        return new Konzert(object);
    }
    // eslint-disable-next-line lodash/prefer-constant
    get isVermietung() {
        return false;
    }
    reset() {
        super.reset();
        this.kopf.abgesagt = false;
        this.kopf.rechnungAnKooperation = false;
        this.unterkunft = new Unterkunft(undefined, new DatumUhrzeit().setUhrzeit(20, 0), []);
        this.kasse = new Kasse();
        this.changelist = undefined;
    }
    // Image Overview
    get suitableForImageOverview() {
        return {
            id: this.id || "",
            startDate: this.startDatumUhrzeit.tagMonatJahrKompakt,
            titel: this.kopf.titel,
            url: this.url || "",
            images: this.presse.image,
        };
    }
    // Dates and Times
    get getinDatumUhrzeit() {
        return this.startDatumUhrzeit.minus({ stunden: 4 });
    }
    // iCal
    get tooltipInfos() {
        return (this.kopf.ort !== "Jazzclub" ? this.kopf.ort : "") + this.staff.tooltipInfos;
    }
    // CSV Export
    toCSV() {
        return `${this.kopf.titelMitPrefix};${this.kopf.eventTyp};${this.startDatumUhrzeit.fuerCsvExport}`;
    }
    updateImageName(oldname, newname) {
        this.presse.image = filter(this.presse.image, (each) => each !== oldname);
        this.presse.image.push(newname);
    }
}
