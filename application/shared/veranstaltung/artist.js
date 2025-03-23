import misc from "../commons/misc.js";
import Misc from "../commons/misc.js";
import keys from "lodash/keys.js";
export default class Artist {
    constructor(object) {
        this.bandname = "";
        this.name = [];
        this.numMusiker = 1;
        this.numCrew = 0;
        this.isBawue = false;
        this.isAusland = false;
        this.brauchtHotel = false;
        if (object && keys(object).length !== 0) {
            const getIn = Misc.stringOrDateToDate(object.getInForMasterDate);
            Object.assign(this, object, {
                name: misc.toArray(object.name), // legacy, was text before
                getInForMasterDate: getIn,
                bandTransport: object.bandTransport,
            });
        }
    }
}
