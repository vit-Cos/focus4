// @ts-check
const fs = require("fs");
const glob = require("glob");
const rimraf = require("rimraf");

glob("packages/*/lib", null, (_, files) => files && files.forEach(f => rimraf.sync(f)));
glob("packages/*/src/**/*.css.d.ts", null, (_, files) => files && files.forEach(f => fs.unlinkSync(f)));
rimraf.sync("node_modules");
