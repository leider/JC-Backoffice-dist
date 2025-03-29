import Fs from "fs/promises";
import Git from "./gitmech.js";
import filter from "lodash/filter.js";
import map from "lodash/map.js";
import fs from "fs";
import path from "path";
import conf from "../../simpleConfigure.js";
const wikiUploadDir = conf.wikiUploadDir;
export default {
    BLOG_ENTRY_FILE_PATTERN: "blog_*",
    showPage: async function showPage(completePageName, pageVersion) {
        return Git.readFile(completePageName + ".md", pageVersion);
    },
    pageSave: async function pageSave(subdir, pageName, content, user) {
        try {
            const stats = await Fs.stat(Git.absPath(subdir));
            if (stats && !stats.isDirectory()) {
                await Fs.mkdir(Git.absPath(subdir));
            }
        }
        catch {
            await Fs.mkdir(Git.absPath(subdir));
        }
        const completePageName = `${subdir}/${pageName}.md`;
        const pageFile = Git.absPath(completePageName);
        try {
            const contentOld = await Git.readFile(completePageName, "HEAD");
            if (contentOld && content === contentOld) {
                return contentOld;
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        }
        catch (err) {
            if (err && !err.message.includes("does not exist")) {
                throw err;
            }
        }
        await Fs.writeFile(pageFile, content);
        Git.add(completePageName, "no comment", user);
        return content;
    },
    pageDelete: async function pageDelete(subdir, pageName, user) {
        const completePageName = subdir + "/" + pageName + ".md";
        await Git.readFile(completePageName, "HEAD");
        return Git.rm(completePageName, "no comment", user);
    },
    search: async function search(searchtext) {
        const items = await Git.grep(searchtext);
        return map(filter(items, (item) => item.trim() !== ""), (item) => {
            const record = item.split(":");
            return {
                pageName: record[0].split(".")[0],
                line: record[1],
                text: record.slice(2).join(""),
            };
        });
    },
    saveWikiImage: async function saveWikiImage({ datei }) {
        async function copyFile(src, dest) {
            return new Promise((resolve, reject) => {
                const readStream = fs.createReadStream(src);
                readStream.once("error", reject);
                readStream.once("end", () => resolve("whatever"));
                readStream.pipe(fs.createWriteStream(dest));
            });
        }
        async function copyToDestination(datei) {
            const dateiname = datei.originalFilename.replace(/[()/]/g, "_");
            await copyFile(datei.path, path.join(wikiUploadDir, dateiname));
            return dateiname;
        }
        return copyToDestination(datei);
    },
};
