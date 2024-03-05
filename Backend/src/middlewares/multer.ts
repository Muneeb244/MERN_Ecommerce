import multer from "multer";
import { v4 as uuid } from "uuid";


const storage = multer.diskStorage({
  destination(req, file, callback) {
    console.log("Destination:", "uploads");
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    console.log("Generated filename:", `${id}.${extName}`);
    callback(null, `${id}.${extName}`);
  },
});


export const singleUpload = multer({ storage }).single("photo");