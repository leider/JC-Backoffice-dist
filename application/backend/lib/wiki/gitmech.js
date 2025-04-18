import gitExec from "./gitExec.js";
import conf from "../../simpleConfigure.js";
import filter from "lodash/filter.js";
const workTree = conf.wikipath;
function dataToLines(data) {
    return data ? filter(data.split("\n"), (v) => v !== "") : [];
}
function esc(arg) {
    // to secure command line execution
    return `'${arg}'`;
}
async function commit(path, message, author) {
    return gitExec.command(["commit", `--author=${esc(author)}`, "-m", esc(message), esc(path)]);
}
export default {
    absPath: function absPath(path) {
        return workTree + "/" + path;
    },
    readFile: async function readFile(path, version) {
        return gitExec.command(["show", version + ":" + esc(path)]);
    },
    add: async function add(path, message, author) {
        await gitExec.command(["add", esc(path)]);
        return commit(path, message, author);
    },
    rm: async function rm(path, message, author) {
        await gitExec.command(["rm", esc(path)]);
        return commit(path, message, author);
    },
    grep: async function grep(pattern) {
        try {
            const data = await gitExec.command(["grep", "--no-color", "-F", "-n", "-i", "-I", esc(pattern)]);
            // Search in the file names
            const data1 = await gitExec.command(["ls-files", `*${esc(pattern)}*.md`]);
            const result = data ? data.split("\n") : [];
            return data1 ? result.concat(data1.split("\n")) : result;
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        }
        catch (e) {
            if (e.message && e.message.split("\n").length < 3) {
                return [];
            }
            throw e;
        }
    },
    ls: async function ls(subdir) {
        const data = await gitExec.command(["ls-tree", "--name-only", "-r", "HEAD", esc(subdir)]);
        return dataToLines(data);
    },
    lsdirs: async function lsdirs() {
        if (!workTree) {
            return [];
        } // to make it run on dev systems
        const data = await gitExec.command(["ls-tree", "--name-only", "-d", "HEAD"]);
        return dataToLines(data);
    },
};
