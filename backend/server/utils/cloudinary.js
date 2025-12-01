import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadStream = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "live-map" }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

// middleware wrapper: multer then upload buffers to cloudinary before req reaches handler
const uploaderMiddleware = (req, res, next) => {
  const middleware = upload.any();
  middleware(req, res, async (err) => {
    if (err) return next(err);
    if (!req.files || req.files.length === 0) return next();
    try {
      const uploaded = [];
      for (const f of req.files) {
        const r = await uploadStream(f.buffer);
        uploaded.push(r.secure_url);
      }
      // attach to req.files as array of { path: url }
      req.files = uploaded.map(url => ({ path: url }));
      next();
    } catch (e) {
      next(e);
    }
  });
};

export default uploaderMiddleware;
