// Initialize route with initRoute()

const authController = require("../../app/http/controllers/authController");
const cartController = require("../../app/http/controllers/customers/cartController");
const homeController = require("../../app/http/controllers/homeController");
const guest = require('../../app/http/middlewares/guest');

const initRoute = (app) => {
  // app is an express object that passing from server.js
  app.get("/", homeController().index);

  // cart get method
  app.get("/cart", cartController().cart);
  app.post('/update-cart', cartController().update);

  // auth get method
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);


  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  //loogut
  app.post("/logout", authController().logout);

};

module.exports = initRoute;
