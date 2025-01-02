import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "../../uploads"));
    },
    filename: function (req, file, callback) {
        // Create a unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callback) => {
    if (file.fieldname === "audio") {
        // Accept audio files
        if (file.mimetype.startsWith("audio/")) {
            callback(null, true);
        } else {
            callback(new Error("File type not supported. Please upload an audio file."), false);
        }
    } else if (file.fieldname === "image") {
        // Accept image files
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("File type not supported. Please upload an image file."), false);
        }
    } else {
        callback(new Error("Unknown field name"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

export default upload;