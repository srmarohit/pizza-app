 // create cartController factory unction. 

 const cartController = () =>{

    // it return an object has a callback function of their respective routes.
    return {
        cart : (req,res) => {
            res.render('customers/cart')
        },

        update : (req,res) => {
            // Structure cart if first time request
            if(!req.session.cart){
                 // define a structure of cart into session object
                 req.session.cart = {
                     items : {
                         // store two property
                         //pizzaId : { item : pizzaObject , qty : 0}
                         
                      } ,
                     totalQty : 0,
                     totalPrice : 0
                 }
            }

            //Note : Before any req.body request 
            // you first to apply middleware app.use(express.json()) to main file server.js

            // store req.session.cart to variable cart

            let cart = req.session.cart ;

            // check if items does not exist in cart

            if(!cart.items[req.body._id]){
                // create items object with this items id
                cart.items[req.body._id] = {
                    item : req.body , // store pizza object
                    qty : 1 // default set for first time add 
                }
            }else{
                // if this pizzaId has already available
                // then just simply increment by 1 to their pizza quantity.
                cart.items[req.body._id].qty =  cart.items[req.body._id].qty + 1 ;
            }

            //finally add totalQty and totalPrice

            cart.totalQty = cart.totalQty + 1 ;
            cart.totalPrice = cart.totalPrice + req.body.price ;


            return res.send({totalQty : req.session.cart.totalQty})
        },

        updateQty : (req,res)=>{
            // console.log(req.body.changeType)
            let cart = req.session.cart ;
            let pizza = cart.items[req.body.pizza_id] ;
            let price = pizza.item.price;

            if(req.body.changeType === "increment"){
                pizza.qty = pizza.qty + 1 ;
                cart.totalQty = cart.totalQty + 1 ;

                price = pizza.qty * pizza.item.price ;
                cart.totalPrice = cart.totalPrice + pizza.item.price ;
                
               // console.log(pizza.qty)
               // console.log(cart.totalQty)
               // console.log(cart.totalPrice)
               // console.log(price)

                const updateItem = {
                    pizza_qty : pizza.qty,
                    totalQty : cart.totalQty,
                    totalPrice : cart.totalPrice,
                    pizza_price : price
                } ;

                return res.send(updateItem) ;
            }else{

                if(pizza.qty > 1){
                    pizza.qty = pizza.qty - 1 ;
                    cart.totalQty = cart.totalQty - 1 ;
    
                    price = pizza.qty * pizza.item.price ;
                    cart.totalPrice = cart.totalPrice - pizza.item.price ;      
                }
                
              //  console.log(pizza.qty)
              //  console.log(cart.totalQty)
              //  console.log(cart.totalPrice)
              //  console.log(price)

                const updateItem = {
                    pizza_qty : pizza.qty,
                    totalQty : cart.totalQty,
                    totalPrice : cart.totalPrice,
                    pizza_price : price
                } ;

                return res.send(updateItem) ;
            }
        },

        removeItem : (req,res) => {
            //console.log("data: ",req.body)
             // store req.session.cart to variable cart
             let cart = req.session.cart ;
             let pizza = cart.items[req.body.pizza_id];
             //console.log(cart.items[req.body.pizza_id])

             cart.totalQty -= pizza.qty ;
             cart.totalPrice -= pizza.item.price *  pizza.qty;
             delete cart.items[req.body.pizza_id];

             return res.send({totalQty : req.session.cart.totalQty})

        }
    }
}

module.exports = cartController ;