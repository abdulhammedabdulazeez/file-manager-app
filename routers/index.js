const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get API status
 *     tags: [App]
 *     responses:
 *       200:
 *         description: API is live
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API is live
 */
router.get("/status", AppController.getStatus);

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get application statistics
 *     tags: [App]
 *     responses:
 *       200:
 *         description: Application statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: integer
 *                   example: 100
 *                 files:
 *                   type: integer
 *                   example: 200
 */
router.get("/stats", AppController.getStats);

module.exports = router;