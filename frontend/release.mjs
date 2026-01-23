import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'node:process';
import { execSync } from "node:child_process";

const currentVersion = process.env.npm_package_version;

const currentVersionParts = currentVersion.split(".");
let major = parseInt(currentVersionParts[0]);
let minor = parseInt(currentVersionParts[1]);
let patch = parseInt(currentVersionParts[2]) + 1;
const newVersion = `${major}.${minor}.${patch}`;

const git_status = execSync('git status').toString();
const isMain = git_status.search("On branch main") >= 0;
const allPushed = git_status.search("Your branch is up to date with 'origin/main'.") >= 0;
const isClean = git_status.search("nothing to commit, working tree clean") >= 0;
if (!isMain) {
    console.log("Error: Not on branch main, will not perform release!");
}
if (!allPushed) {
    console.log("Error: There are commits that are not pushed to the server yet, will not perform release!");
}

if (!isClean) {
    console.log("Error: There are pending changes, will not perform release!");
}

if (!isMain || !allPushed || !isClean) {
    process.exit();
}

const rl = readline.createInterface({ input, output });
const msg = `Do you want to release v${currentVersion}?
Doing so will do the following:
 - create git tag v${currentVersion}
 - push the tag and build a new release
 - bump version to ${newVersion}
 - commit and push bumped version
Do you want to continue? (y/n) `;
const answer = await rl.question(msg);
rl.close();

if (answer === "y") {
    execSync(`git tag -- v${currentVersion}`);
    execSync(`git push origin tag v${currentVersion}`);
    execSync(`npm version ${newVersion}`);
    execSync(`git add -- package.json`);
    execSync(`git commit -m "bump version to ${newVersion}"`);

    console.log("OK");
} else {
    console.log("Cancelled, version remains the same and no new release is built!");
}
