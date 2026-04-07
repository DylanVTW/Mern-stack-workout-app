import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../confi/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "workout-app/uploads",
        resource_type: "auto", 
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif",],
    },
});

export const uploadProfileImage = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024* 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpg","image/jpeg", "image/png", "image/webp", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed."), false);
        }
    },
 });

 export default uploadProfileImage;
