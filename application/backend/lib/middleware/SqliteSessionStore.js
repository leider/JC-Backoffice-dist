import { Store } from "express-session";
export default class SqliteSessionStore extends Store {
    constructor(db, ttl) {
        super();
        this.ttl = ttl;
        const hasExpiredCol = db.prepare(`SELECT COUNT(*) as cnt FROM pragma_table_info('sessions') WHERE name = 'expired'`).get();
        if (!hasExpiredCol || hasExpiredCol.cnt === 0) {
            db.exec(`DROP TABLE IF EXISTS sessions`);
        }
        db.exec(`CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, sess TEXT NOT NULL, expired INTEGER NOT NULL)`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired)`);
        this.stmtGet = db.prepare(`SELECT sess FROM sessions WHERE sid = ? AND expired > ?`);
        this.stmtSet = db.prepare(`REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)`);
        this.stmtDestroy = db.prepare(`DELETE FROM sessions WHERE sid = ?`);
        this.stmtTouch = db.prepare(`UPDATE sessions SET expired = ? WHERE sid = ?`);
        this.stmtCleanup = db.prepare(`DELETE FROM sessions WHERE expired < ?`);
        this.cleanupTimer = setInterval(() => this.stmtCleanup.run(Date.now()), 15 * 60 * 1000);
        this.cleanupTimer.unref();
    }
    expiration(session) {
        return Date.now() + (session.cookie?.maxAge ?? this.ttl);
    }
    get(sid, callback) {
        try {
            const row = this.stmtGet.get(sid, Date.now());
            callback(null, row ? JSON.parse(row.sess) : null);
        }
        catch (e) {
            callback(e);
        }
    }
    set(sid, session, callback) {
        try {
            this.stmtSet.run(sid, JSON.stringify(session), this.expiration(session));
            callback?.();
        }
        catch (e) {
            callback?.(e);
        }
    }
    destroy(sid, callback) {
        try {
            this.stmtDestroy.run(sid);
            callback?.();
        }
        catch (e) {
            callback?.(e);
        }
    }
    touch(sid, session, callback) {
        try {
            this.stmtTouch.run(this.expiration(session), sid);
            callback?.();
        }
        catch (e) {
            callback?.(e);
        }
    }
}
