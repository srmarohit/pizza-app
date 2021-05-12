
// define orderController to get order from customer 

const Order = require("../../../models/order");
const moment = require('moment'); 

function orderController(){
    return {
          // GET ROute : /customer/orders
        index : async (req,res) =>{
            // find all orders regarding this user.
            const orders = await Order.find({customerId : req.user._id},
                null,
                {sort : {'createdAt' : -1} }
                );

                // set header of response to clear cache if user back after ordering
                res.header('Cache-Control','no-cache, no-store')
              // return an array orders.
            if(!orders.length){
                console.log("No order is placed..")
            }

            //console.log(orders)
            // render customer/order page

            return res.render('customers/order', { orders, moment }) ; // moment for format the time
            
        },
                  // POST ROute : /orders
        store : (req,res) => {
           // console.log(req.body)
           // validate user provided fields 
           const {phone, address} = req.body ;
           if(!phone  || !address){
               req.flash('phone', phone)
               req.flash('address', address)
               req.flash('error','All fields required.')
               return res.redirect('/cart')
           }

           // create new order 

           const order = new Order({
               customerId : req.user._id,
               items : req.session.cart.items,
               phone,
               address
           })

           // save the order
           order.save().then(result => {
            // after saved it returns result has order object.
            if(result){
                req.flash('success' ,'Your order is placed successfully !')
                // empty cart
                delete req.session.cart ;

                //but we need to populate customerId from order to get a customer name  
                Order.populate(result, {path : 'customerId'}, (err, placedOrder)=>{
                    
                // Emit an event to the admin statuscontroller panel
                const eventEmitter = req.app.get('eventEmitter') ;
                eventEmitter.emit('orderPlaced', placedOrder);
                // redirect orders page
                return res.redirect('/customer/orders')
               
                }) 
            }

        }).catch(err => {
               req.flash('error', 'Something went wrong')
               return res.redirect('/cart')
           })

        }
    }
}

module.exports = orderController ;