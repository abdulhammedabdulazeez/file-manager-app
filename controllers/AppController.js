const dbClient = require("../utils/db");

class AppController {
  static getStatus(request, response) {
    response.status(200).json({ message: request.__('app.api_is_live') });
    // .json({ db: dbClient.isAlive() });
  }

  static async getStats(request, response) {
    const usersNum = await dbClient.nbUsers();
    const filesNum = await dbClient.nbFiles();
    response.status(200).json({ users: usersNum, files: filesNum });
  }
}

module.exports = AppController;
