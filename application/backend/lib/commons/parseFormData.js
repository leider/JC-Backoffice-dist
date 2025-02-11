import { Form } from "multiparty";
export default async function parseFormData(req) {
    const upload = (req1) => new Promise((resolve, reject) => {
        new Form().parse(req1, function (err, fields, files) {
            if (err) {
                return reject(err);
            }
            return resolve({ fields, files });
        });
    });
    return await upload(req);
}
