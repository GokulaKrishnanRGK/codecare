import fs from "fs/promises";
import path from "path";

export class LocalFsStorage {
  constructor({baseDir, publicUrlPrefix}) {
    this.baseDir = baseDir;
    this.publicUrlPrefix = publicUrlPrefix;
  }

  async save({folder, filename, buffer}) {
    const safeName = filename.replace(/[^\w.\-]/g, "_");
    const key = `${folder}/${Date.now()}-${safeName}`;
    const absPath = path.join(this.baseDir, key);

    await fs.mkdir(path.dirname(absPath), {recursive: true});
    await fs.writeFile(absPath, buffer);

    return {key, url: `${this.publicUrlPrefix}/${key}`};
  }

  async getPublicUrl(key) {
    return `${this.publicUrlPrefix}/${key}`;
  }
}
