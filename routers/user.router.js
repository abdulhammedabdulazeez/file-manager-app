const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const passport = require("passport");
require("../auth/passport");

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       400:
 *         description: User not found
 */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);

/**
 * @swagger
 * /users/setLanguage:
 *   post:
 *     summary: Set user language preference
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 example: "fr"
 *     responses:
 *       200:
 *         description: Language preference set successfully
 *       400:
 *         description: Missing language
 */
router.post(
  "/setLanguage",
  passport.authenticate("jwt", { session: false }),
  userController.setLanguage
);

module.exports = router;
