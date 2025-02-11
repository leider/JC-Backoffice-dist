import { marked } from "marked";
import misc from "./misc.js";
import isNil from "lodash/isNil.js";
import forEach from "lodash/forEach.js";
import keys from "lodash/keys.js";
function normalize(str) {
    if (str.trim() === "") {
        return "";
    }
    return misc.normalizeString(str);
}
marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
});
function evalTags(text, subdir) {
    let result = text;
    const tagmap = {};
    // Yields the content with the rendered [[bracket tags]]
    // The rules are the same for Gollum https://github.com/github/gollum
    const matches = result.match(/(.?)\[\[(.+?)]]([^[]?)/g);
    forEach(matches, (match) => {
        const tag = /(.?)\[\[(.+?)]](.?)/.exec(match.trim());
        if (!tag) {
            return;
        }
        if (tag[1] === "'") {
            return;
        }
        const id = encodeURIComponent(tag[2]);
        tagmap[id] = tag[2] || "";
        result = result.replace(tag[0] ?? "", id);
    });
    forEach(keys(tagmap), (key) => {
        const parts = tagmap[key].split("|");
        const pageName = parts[1] ?? parts[0];
        tagmap[key] = `<a class="internal" href="/wiki/${subdir ?? "alle"}/${normalize(pageName.toLowerCase())}">${parts[0]}</a>`;
        result = result.replace(new RegExp(key, "g"), tagmap[key]);
    });
    return result;
}
function enhanceTableTag(rendered) {
    return rendered
        .replace(/<table>/g, '<table class="table table-condensed table-hover table-striped">')
        .replace(/<img src=/g, '<img class="img-responsive" src=');
}
export default {
    render: function render(content, subdir) {
        if (isNil(content)) {
            return "";
        }
        const rendered = marked(evalTags(content, subdir));
        return enhanceTableTag(rendered);
    },
    normalize,
    titleAndRenderedTail: function titleAndRenderedTail(content, subdir) {
        const tokens = marked.lexer(evalTags(content, subdir));
        if (tokens.length === 0) {
            return { title: "", body: "" };
        }
        const title = tokens.shift();
        const rendered = marked.parser(tokens);
        return {
            title: title && "text" in title ? title.text : "",
            body: enhanceTableTag(rendered),
        };
    },
};
