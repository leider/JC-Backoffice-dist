import Konzert from "./konzert.js";
export default class KonzertWithRiderBoxes extends Konzert {
    constructor(object) {
        super(object);
        this.riderBoxes = object?.riderBoxes;
    }
}
