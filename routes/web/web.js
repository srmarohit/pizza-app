// Initialize route with initRoute()

const authController = require("../../app/http/controllers/authController");
const cartController = require("../../app/http/controllers/customers/cartController");
const homeController = require("../../app/http/controllers/homeController");
const orderController = require("../../app/http/controllers/customers/orderController");

const guest = require('../../app/http/middlewares/guest');
const auth = require("../../app/http/middlewares/auth");
const adminOrderController = require("../../app/http/controllers/admin/orderController");
const admin = require("../../app/http/middlewares/admin");
const statusController = require("../../app/http/controllers/admin/statusController");
const singleOrderStatus = require("../../app/http/controllers/customers/singleOrderStatus");
const menuController = require("../../app/http/controllers/menuController");

const initRoute = (app) => {
  // app is an express object that passing from server.js
  app.get("/", homeController().index);

  // for /menus menus.ejs page
  app.get("/menus", menuController().products) ;

  // cart get method
  app.get("/cart", cartController().cart);
  app.post('/update-cart', cartController().update);
  app.post('/remove-cart-item', cartController().removeItem)
  app.post('/update-qty', cartController().updateQty)


  // auth get method
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);


  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  app.get("/auth/facebook", authController().facebookLogin);
  app.get("/auth/facebook/done", authController().facebookLoginCallback)

  app.get("/auth/instagram", authController().instagramLogin)
  app.get("/auth/instagram/done", authController().instagramLoginCallback)

  
  app.get("/auth/google", authController().googleLogin)
  app.get("/auth/google/done", authController().googleLoginCallback)

  //loogut
  app.post("/logout", authController().logout);


  //orders routes

  app.post('/orders', auth,  orderController().store )
  app.get('/customer/orders', auth, orderController().index)
  app.get('/customer/order/:id', auth, singleOrderStatus().orderDetail)
  app.get('/customer/order/status/:id', auth, singleOrderStatus().status)

  //Admin ROutes
  app.get('/admin/orders',admin, adminOrderController().index )
  app.post('/admin/order/status' , admin, statusController().update);
};

module.exports = initRoute;
