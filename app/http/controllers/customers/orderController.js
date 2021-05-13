// define orderController to get order from customer

const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_KEY);

function orderController() {
  return {
    // GET ROute : /customer/orders 
    index: async (req, res) => {
      // find all orders regarding this user.
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });

      // set header of response to clear cache if user back after ordering
      res.header("Cache-Control", "no-cache, no-store");
      // return an array orders.
      if (!orders.length) {
        console.log("No order is placed..");
      }

      //console.log(orders)
      // render customer/order page

      return res.render("customers/order", { orders, moment }); // moment for format the time
    },
    // POST ROute : /orders
    store: (req, res) => {
      //console.log(req.body);
      // validate user provided fields
      const { phone, address, stripeToken, paymentType } = req.body;

      if (!phone || !address) {
        // req.flash('phone', phone)
        // req.flash('address', address)
        // req.flash('error','All fields required.')
        // return res.redirect('/cart')

        // we dont need above lines becoz using ajax call
        return res.status(422).json({ message: "All Fields Required " });
      }

      // create new order

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      // save the order
      order
        .save()
        .then((result) => {
          // first we place order then we go for payment
          // after saved it returns result has order object.
          if (result) {
            // req.flash('success' ,'Your order is placed successfully !')

            //but we need to populate customerId from order to get a customer name
            Order.populate(
              result,
              { path: "customerId" },
              (err, placedOrder) => {
                //Stripe Payment
                if (paymentType === "card") {
                  // if user go for card payment
                  stripe.charges
                    .create({
                      amount: req.session.cart.totalPrice * 100, // actually stripe takes payments in paisa
                      source: stripeToken,
                      currency: "inr",
                      description: `pizza order : ${placedOrder._id}`, // in description store order id for refund related issue
                    })
                    .then(() => {
                      // update order with paymentStatus
                      placedOrder.paymentStatus = true;
                      placedOrder.paymentType = paymentType;
                      placedOrder
                        .save()
                        .then((orderData) => {
                          // Emit to admin panel for placed order
                          const eventEmitter = req.app.get("eventEmitter");
                          eventEmitter.emit("orderPlaced", orderData);
                          // empty cart
                          delete req.session.cart;
                          return res.json({
                            message: "Payment Successfull! and Order Placed ",
                          });
                        })
                        .catch((err) => {
                          console.log(err, "error to save payment full order");
                          return ;
                        });
                    })
                    .catch((err) => {
                      // Emit to admin panel for placed order
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", placedOrder);
                      // empty cart
                      delete req.session.cart;
                      return res.json({
                        message:
                          "Order Placed but Payment Failed ! but you can pay at delivery time ",
                      });
                    });
                } else {
                  // Emit an event to the admin statuscontroller panel
                  const eventEmitter = req.app.get("eventEmitter");
                  eventEmitter.emit("orderPlaced", placedOrder);

                  // empty cart
                  delete req.session.cart;

                  // return response in json
                  return res.json({ message: "your order is placed." });
                  // redirect orders page
                  // return res.redirect('/customer/orders')
                }
              }
            );
          }
        })
        .catch((err) => {
          // req.flash("error", "Something went wrong");
          return res.status(500).json({ message: "Something went wrong " });
        });
    },
  };
}

module.exports = orderController;
