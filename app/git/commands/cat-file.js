const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class catFileCommand {
  constructor(flag, hash) {
    this.flag = flag;
    this.hash = hash;
  }
  execute() {
    const flag = this.flag;
    const hash = this.hash;
    switch (flag) {
      case "-p":
        {
          const folder = hash.slice(0, 2);
          const fileName = hash.slice(2);
          const Path = path.join(
            process.cwd(),
            ".git",
            "objects",
            folder,
            fileName
          );

          if (!fs.existsSync(Path)) {
            throw new Error(`File not found ${hash}`);
          }

          const content = fs.readFileSync(Path);

          const dataUnzipped = zlib.inflateSync(content);
          const res = dataUnzipped.toString().split("\0")[1];
          process.stdout.write(res);
        }
        break;
      default:
        throw new Error(`Unknown flag ${flag}`);
    }
  }
}

module.exports = catFileCommand;
