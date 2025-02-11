import map from "lodash/map.js";
export default function formatMailAddresses(addresses) {
    return map(addresses, ({ name, address }) => `"${name}" <${address}>`);
}
