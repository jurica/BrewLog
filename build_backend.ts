import { log, runCommands } from "./common.ts";

const cmds = [
  "go mod download",
  `go build -tags production -ldflags '-s -w -X github.com/pocketbase/pocketbase.Version=${process.env.npm_package_version}'`
];

log(`Will build BrewLog backend v${process.env.npm_package_version}`);
runCommands(cmds, "./backend");

log("Build finished.");
