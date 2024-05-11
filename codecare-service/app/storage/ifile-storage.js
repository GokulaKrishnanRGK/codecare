export class IFileStorage {
  async save({ folder, filename, buffer }) {
    throw new Error("Not implemented");
  }

  async getPublicUrl(key) {
    throw new Error("Not implemented");
  }
}
