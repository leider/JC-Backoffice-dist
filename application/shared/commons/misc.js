/* eslint-disable @typescript-eslint/no-explicit-any */
import DatumUhrzeit from "./DatumUhrzeit.js";
import isArray from "lodash/isArray.js";
import isString from "lodash/isString.js";
import map from "lodash/map.js";
import filter from "lodash/filter.js";
import keys from "lodash/keys.js";
function isNumber(aString) {
    const number = Number.parseInt(aString);
    return !!number || number === 0;
}
function stringOrDateToDate(object) {
    if (!object) {
        return undefined;
    }
    return isString(object) ? DatumUhrzeit.forISOString(object).toJSDate : object;
}
function toObject(Constructor, jsobject) {
    if (jsobject && keys(jsobject).length > 0) {
        delete jsobject._csrf;
        return new Constructor(jsobject);
    }
    return null;
}
function toObjectList(Constructor, jsobjects) {
    return filter(map(jsobjects, (each) => toObject(Constructor, each)), (each) => each !== null);
}
function toArray(elem) {
    if (!elem) {
        return [];
    }
    if (isArray(elem)) {
        return elem;
    }
    if (isString(elem)) {
        return elem.split(",");
    }
    return [elem];
}
function pushImage(images, image) {
    let result;
    if (isString(images)) {
        result = [images];
    }
    else {
        result = images;
    }
    if (!result.includes(image)) {
        result.push(image);
        return result;
    }
    return result;
}
function dropImage(images, image) {
    return isString(images) ? [] : filter(images, (each) => each !== image);
}
function normalizeString(input) {
    return input
        .replace(/[äÄàáÀÁâÂ]/gi, "a")
        .replace(/[èéÈÉêÊ]/gi, "e")
        .replace(/[ìíÌÍîÎ]/gi, "i")
        .replace(/[öÖòóÒÓôÔ]/gi, "o")
        .replace(/[üÜùúÙÚûÛ]/gi, "u")
        .replace(/ß/g, "s")
        .trim()
        .replace(/\s/g, "_")
        .replace(/\//g, "_")
        .replace(/[^a-zA-Z0-9\- _]/g, "")
        .toLowerCase();
}
export default {
    isNumber,
    normalizeString,
    toObject,
    toObjectList,
    stringOrDateToDate,
    dropImage,
    pushImage,
    toArray,
};
