import Misc from "../commons/misc.js";
export class Rider {
    constructor(object) {
        this.id = "";
        this.startDate = new Date();
        this.boxes = [];
        Object.assign(this, object, {
            startDate: Misc.stringOrDateToDate(object?.startDate || ""),
            boxes: object?.boxes || [],
        });
    }
    toJSON() {
        return Object.assign({}, this);
    }
}
export class PrintableBox {
    constructor(params) {
        this.category = "Extra";
        this.degree = 0;
        this.height = 0;
        this.id = "";
        this.left = 0;
        this.level = 0;
        this.title = "";
        this.top = 0;
        this.width = 0;
        this.img = undefined;
        this.isCircle = false;
        Object.assign(this, params);
    }
    get divStyleForImg() {
        return `position: absolute; left: ${this.left}px; top: ${this.top}px; width: ${this.width}px; height: ${this.height}px; rotate: ${this.degree}deg; z-index: ${this.level};`;
    }
    get imgStyle() {
        return `width: ${this.img?.width}px; height: ${this.img?.height}px;`;
    }
    get divStyleForText() {
        return (this.divStyleForImg +
            `line-height: ${this.height}px;` +
            "text-align: center; font-size: 10px; border: 0.2px solid gray;" +
            `border-radius: ${this.isCircle ? "50%" : 0};`);
    }
}
