// create a orderController() to get all orders from all customers 
// and display to admin orders page.

const Order = require("../../../models/order");
const moment = require('moment');

const orderController = () =>{

    return {
    // GET Route - /admin/orders 
    index : (req,res) => {
        // get customer details with find orders that is not completed yet.
        Order.find({status : {$ne : 'completed'}}, null , {sort : {'createdAt' : -1}})
        .populate('customerId', '-password').exec((err, orders)=>{
            // while populating customerId then we get details of user with orders
            // '-password' set as second parameter that we dont want to get user passowrd.
                //console.log(orders)
            // render admin/orders page
                if(req.xhr){
                    return res.json(orders)
                }

          return res.render('admin/orders')
        })
    } // index block ends
    
  }// return block ends
}

module.exports = orderController ;