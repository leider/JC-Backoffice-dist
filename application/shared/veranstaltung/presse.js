import misc from "../commons/misc.js";
import keys from "lodash/keys.js";
export default class Presse {
    constructor(object) {
        this.originalText = "";
        this.text = "";
        this.image = [];
        this.checked = false;
        this.jazzclubURL = "";
        if (object && keys(object).length) {
            Object.assign(this, object, {
                image: misc.toArray(object.image),
            });
            if (!this.originalText) {
                this.originalText = "";
            }
        }
    }
    updateImage(image) {
        const imagePushed = misc.pushImage(this.image, image);
        if (imagePushed.length > 0) {
            this.image = imagePushed;
            return true;
        }
        return false;
    }
    removeImage(image) {
        this.image = misc.dropImage(this.image, image);
    }
    get firstImage() {
        return this.image[0];
    }
    imageURL(prefix) {
        if (this.image.length > 0) {
            return "**Pressephoto:**\n" + this.imageURLpure(prefix);
        }
        return "";
    }
    imageURLpure(prefix) {
        if (this.image.length > 0) {
            return prefix + "/upload/" + encodeURIComponent(this.firstImage);
        }
        return "";
    }
    get fullyQualifiedJazzclubURL() {
        return "https://www.jazzclub.de/event/" + this.jazzclubURL;
    }
}
