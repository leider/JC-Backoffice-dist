export async function checkSuperuser(req, res, next) {
    if (!req.user.accessrights.isSuperuser) {
        res.sendStatus(403);
        return;
    }
    next();
}
export async function checkOrgateam(req, res, next) {
    if (!req.user.accessrights.isOrgaTeam) {
        res.sendStatus(403);
        return;
    }
    next();
}
export async function checkCanEditUser(req, res, next) {
    if (!req.user.accessrights.canEditUser(req.body.id)) {
        res.sendStatus(403);
        return;
    }
    next();
}
export async function checkAbendkasse(req, res, next) {
    if (!req.user.accessrights.isAbendkasse) {
        res.sendStatus(403);
        return;
    }
    next();
}
