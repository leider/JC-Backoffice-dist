import pug from "pug";
import Renderer from "jc-shared/commons/renderer.js";
export default class MailBodyRenderer {
    constructor(markdown) {
        this.markdown = markdown;
    }
    get rendered() {
        return Renderer.render(this.markdown);
    }
    get html() {
        return pug.render(`doctype html
html: body !{content}
`, { pretty: true, content: this.rendered });
    }
    get text() {
        return this.markdown;
    }
}
