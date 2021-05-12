
// define callback function of change status order

const Order = require("../../../models/order");

function statusController(){
    return {
        update : (req,res) => {
            // update status of order
          Order.updateOne({_id : req.body.orderId},  // search document based on this _id
            {status : req.body.status}, // update status field of that document
            (err, data)=>{ // return data
                if(err){
                    req.flash('error', 'Unfortunately status could not updated')
                    return res.redirect('/admin/orders')
                }

               // grt eventEmiiter from app
               const eventEmitter = req.app.get('eventEmitter');
               eventEmitter.emit('orderUpdated', {id:req.body.orderId, status:req.body.status}) 
             
               req.flash('success','Order Status succesfully updated. ')  
              return res.redirect('/admin/orders')
            })  
        }
    }
}

module.exports = statusController ;