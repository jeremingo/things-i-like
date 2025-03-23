import express from "express";
const router = express.Router();
import multer, { Multer } from "multer";
if (!multer || typeof multer.diskStorage !== "function") {
  throw new Error("Multer is not properly imported or configured.");
}
import Config from "../env/config";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
});
const upload: Multer = multer({ storage: storage });

router.post('/', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + Config.DOMAIN_BASE + '/' + req.file?.path)
    res.status(200).send({ url: Config.DOMAIN_BASE + '/' + req.file?.path })
});


export = router;