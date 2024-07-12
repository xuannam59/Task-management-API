
const taskRoute = require("./task.route");
const userRoute = require("./user.route");

// middleware
const authMiddleware = require("../middleware/authUser.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);

  app.use(version + "/user", userRoute);
}