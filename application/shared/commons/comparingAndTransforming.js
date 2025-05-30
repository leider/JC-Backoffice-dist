import { detailedDiff } from "deep-object-diff";
import isObject from "lodash/isObject.js";
import cloneDeep from "lodash/cloneDeep.js";
import forEach from "lodash/forEach.js";
import keys from "lodash/keys.js";
/**
 * this function will modify data!
 *
 * @param data an object
 */
function stripNullOrUndefined(data) {
    if (!data) {
        return data;
    }
    if (Array.isArray(data)) {
        data.sort();
    }
    forEach(keys(data), (key) => {
        const dataCasted = data;
        if (dataCasted[key] === null || dataCasted[key] === undefined) {
            delete dataCasted[key];
        }
        if (isObject(dataCasted[key])) {
            // Array is typeof "object"
            stripNullOrUndefined(dataCasted[key]);
        }
        if (key === "key") {
            delete dataCasted[key];
        }
    });
    return data;
}
export function withoutNullOrUndefinedStrippedBy(data, propertiesToIgnore) {
    function deleteProp(clone, nameWithDots) {
        const nameArray = nameWithDots.split(".");
        if (nameArray.length === 0) {
            return;
        }
        const last = nameArray.pop();
        let target = clone;
        forEach(nameArray, (part) => {
            target = target[part];
            if (!target) {
                return;
            }
        });
        if (target) {
            delete target[last];
        }
    }
    const clone = cloneDeep(data);
    forEach(propertiesToIgnore, (key) => {
        deleteProp(clone, key);
    });
    return stripNullOrUndefined(clone);
}
export function areDifferentForHistoryEntries(left, right, propertiesToIgnore) {
    const { neu, alt } = differenceForAsObject(left, right, propertiesToIgnore);
    const neuNotEmpty = !!keys(neu).length;
    const altNotEmpty = !!keys(alt).length;
    return neuNotEmpty || altNotEmpty;
}
export function areDifferent(left, right, propertiesToIgnore) {
    if (!left || !keys(left).length) {
        return false;
    }
    return areDifferentForHistoryEntries(left, right, propertiesToIgnore);
}
export function differenceForAsObject(left = {}, right = {}, propertiesToIgnore) {
    const a = withoutNullOrUndefinedStrippedBy(left, propertiesToIgnore);
    const b = withoutNullOrUndefinedStrippedBy(right, propertiesToIgnore);
    const diffAtoB = detailedDiff(a, b);
    const diffBtoA = detailedDiff(b, a);
    const mergedNeu = Object.assign(diffAtoB.updated ?? {}, diffAtoB.added ?? {});
    const mergedAlt = Object.assign(diffBtoA.updated ?? {}, diffAtoB.deleted ?? {});
    return { neu: mergedNeu, alt: mergedAlt };
}
export function logDiffForDirty(initial, current, enable = false) {
    if (!enable) {
        return;
    }
    const diff = differenceForAsObject(initial, current);
    console.log({ initial, current, diff }); // eslint-disable-line no-console
}
