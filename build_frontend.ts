import { log, runCommands } from "./common.ts";

const cmds = [
    "npm install",
    "npm run build"
];

log(`Will build BrewLog frontend v${process.env.npm_package_version}`);
runCommands(cmds, "./frontend");

log("Build finished.");
