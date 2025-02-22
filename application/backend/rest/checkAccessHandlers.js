function createCheckFor(question) {
    return async (req, res, next) => {
        if (!req.user.accessrights[question]) {
            res.sendStatus(403);
            return;
        }
        next();
    };
}
export const checkSuperuser = createCheckFor("isSuperuser");
export const checkOrgateam = createCheckFor("isOrgaTeam");
export const checkAbendkasse = createCheckFor("isAbendkasse");
export async function checkCanEditUser(req, res, next) {
    if (!req.user.accessrights.canEditUser(req.body.id)) {
        res.sendStatus(403);
        return;
    }
    next();
}
