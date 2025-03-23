import express from "express";
const router = express.Router();
import multer, { Multer } from "multer";
if (!multer || typeof multer.diskStorage !== "function") {
  throw new Error("Multer is not properly imported or configured.");
}
import Config from "../env/config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')
      .filter(Boolean)
      .slice(1)
      .join('.');
    cb(null, Date.now() + "." + ext);
  },
});
const upload: Multer = multer({ storage: storage });

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server and returns the file's URL.
 *     tags:
 *       - File
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The URL of the uploaded file.
 *                   example: http://localhost:3000/storage/1678901234567.png
 *       400:
 *         description: Bad request. File upload failed.
 */
router.post('/', upload.single("file"), function (req, res) {
  console.log("router.post(/file: " + Config.DOMAIN_BASE + '/' + req.file?.path);
  res.status(200).send({ url: Config.DOMAIN_BASE + '/' + req.file?.path });
});

export = router;