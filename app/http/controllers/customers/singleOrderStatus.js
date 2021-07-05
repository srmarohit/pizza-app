
// display and fetch or track single order 

const Order = require("../../../models/order")

function singleOrderStatus(){
    return {

        orderDetail : async (req,res) => {
                 // fetch order id from parameter
            const order = await Order.findById(req.params.id) ;

            // apply condition to access order info by only user who ordered.
            if(req.user._id.toString() === order.customerId.toString()){  // to compare both object id we need to first convert into string format
                    return res.render('customers/orderDetails', {order})
            }

            return res.redirect('/')
        },

        status : async (req,res)=>{
            // fetch order id from parameter
            const order = await Order.findById(req.params.id) ;

            // apply condition to access order info by only user who ordered.
            if(req.user._id.toString() === order.customerId.toString()){  // to compare both object id we need to first convert into string format
                    return res.render('customers/singleOrder', {order})
            }

            return res.redirect('/')
        }
    }
}

module.exports = singleOrderStatus ;