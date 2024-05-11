export class S3Storage {
  constructor({bucket, publicBaseUrl}) {
    this.bucket = bucket;
    this.publicBaseUrl = publicBaseUrl;
  }

  async save({folder, filename, buffer}) {
    throw new Error("S3Storage.save not implemented");
  }

  async getPublicUrl(key) {
    if (!this.publicBaseUrl) {
      throw new Error("Missing S3 public base url");
    }
    return `${this.publicBaseUrl}/${key}`;
  }
}
