const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const { resolve } = require("path");

class hashObjectCommand {
  constructor(flag, filepath) {
    this.flag = flag;
    this.filepath = filepath;
  }
  execute() {
    const filepath = path.resolve(this.filepath);
    // console.log(filepath);
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found ${filepath}`);
    }
    const fileContent = fs.readFileSync(filepath);
    const fileLen = fileContent.length;
    const head = "blob " + fileLen + "\0";
    const blob = Buffer.concat([Buffer.from(head), fileContent]);

    const hash = require("crypto")
      .createHash("sha1")
      .update(blob)
      .digest("hex");
    if (this.flag && this.flag === "-w") {
      const folder = hash.slice(0, 2);
      const fileName = hash.slice(2);
      const Path = path.join(process.cwd(), ".git", "objects", folder);
      if (!fs.existsSync(Path)) {
        fs.mkdirSync(Path, { recursive: true });
      }
      const compressedData = zlib.deflateSync(blob);
      fs.writeFileSync(path.join(Path, fileName), compressedData);
    }
    process.stdout.write(hash);
  }
}

module.exports = hashObjectCommand;
