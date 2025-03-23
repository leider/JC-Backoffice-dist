/* eslint-disable  @typescript-eslint/no-explicit-any*/
import sortBy from "lodash/fp/sortBy.js";
import flowRight from "lodash/fp/flowRight.js";
import toLower from "lodash/fp/toLower.js";
import prop from "lodash/fp/prop.js";
import map from "lodash/map.js";
const sortByNameCaseInsensitive = sortBy(flowRight(toLower, prop("name")));
export class Ort {
    constructor(object) {
        this.name = "";
        this.flaeche = 0;
        if (object) {
            delete object._csrf; // Altlast
            Object.assign(this, object);
        }
    }
}
export default class Orte {
    constructor(object) {
        this.id = "orte";
        this.orte = [];
        if (object && object.orte) {
            this.orte = sortByNameCaseInsensitive(map(object.orte, (o) => new Ort(o)));
        }
    }
    alleNamen() {
        return map(this.orte, "name");
    }
}
