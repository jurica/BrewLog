import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'node:process';
import { exec } from "node:child_process";

const currentVersion = process.env.npm_package_version;
const currentVersionParts = currentVersion.split(".");
let major = parseInt(currentVersionParts[0]);
let minor = parseInt(currentVersionParts[1]);
let patch = parseInt(currentVersionParts[2]) + 1;
const newVersion = `${major}.${minor}.${patch}`;

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
    exec(`git tag -- v${currentVersion}`);
    exec(`git push origin tag v${currentVersion}`);
    exec(`npm version ${newVersion}`);
    exec(`git add -- package.json`);
    exec(`git commit -m "bump version to ${newVersion}"`);

    console.log("OK");
} else {
    console.log("Cancelled, version remains the same and no new release is built!");
}
