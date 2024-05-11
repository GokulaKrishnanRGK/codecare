import path from "path";
import {LocalFsStorage} from "./localfs-storage.js";
import {S3Storage} from "./s3-storage.js";

export const createStorage = () => {
  const provider = process.env.STORAGE_PROVIDER || "local";

  if (provider === "s3") {
    return new S3Storage({
      bucket: process.env.S3_BUCKET,
      publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
    });
  }

  return new LocalFsStorage({
    baseDir: path.resolve(process.env.UPLOAD_DIR || "./userUploads")
  });
};

export const storage = createStorage();
