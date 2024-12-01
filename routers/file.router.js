const express = require("express");
const router = express.Router();
const fileController = require("../controllers/FileController");
require("../auth/passport");
const passport = require("passport");

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: myfile.txt
 *               type:
 *                 type: string
 *                 example: file
 *               parentId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               path:
 *                 type: string
 *                 example: /uploads
 *               data:
 *                 type: string
 *                 example: base64encodeddata
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: files.file_uploaded_successfully
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     name:
 *                       type: string
 *                       example: myfile.txt
 *                     type:
 *                       type: string
 *                       example: file
 *                     parentId:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     path:
 *                       type: string
 *                       example: /uploads
 *                     data:
 *                       type: string
 *                       example: base64encodeddata
 *       400:
 *         description: Bad request
 */
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  fileController.fileUpload
);

/**
 * @swagger
 * /files/readFile/{id}:
 *   get:
 *     summary: Read a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *     responses:
 *       200:
 *         description: File read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     name:
 *                       type: string
 *                       example: myfile.txt
 *                     type:
 *                       type: string
 *                       example: file
 *                     parentId:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     path:
 *                       type: string
 *                       example: /uploads
 *                     data:
 *                       type: string
 *                       example: base64encodeddata
 *       400:
 *         description: File not found
 */
router.get(
  "/readFile/:id",
  passport.authenticate("jwt", { session: false }),
  fileController.readFile
);

/**
 * @swagger
 * /files/updateFile/{id}:
 *   put:
 *     summary: Update a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 example: newbase64encodeddata
 *     responses:
 *       200:
 *         description: File updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: files.file_updated_successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/updateFile/:id",
  passport.authenticate("jwt", { session: false }),
  fileController.updateFile
);

/**
 * @swagger
 * /files/updateFileName/{id}:
 *   put:
 *     summary: Update a file name
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: newfilename.txt
 *     responses:
 *       200:
 *         description: File name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: files.file_name_updated_successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/updateFileName/:id",
  passport.authenticate("jwt", { session: false }),
  fileController.updateFileName
);

/**
 * @swagger
 * /files/deleteFile/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: files.file_deleted_successfully
 *       400:
 *         description: Bad request
 */
router.delete(
  "/deleteFile/:id",
  passport.authenticate("jwt", { session: false }),
  fileController.deleteFile
);

module.exports = router;
