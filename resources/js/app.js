
import axios from 'axios' 
import Noty from 'noty'

// create action on add cart button
 let addCart = document.querySelectorAll('.add-to-cart');  // return array
 let cartCounter = document.querySelector('#cartCounter')

 //create updateCart()
 function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res => {
        //console.log(res) 
        cartCounter.innerText = res.data.totalQty ;

        // show notification 
        new Noty({
           type:'success',
           text : "Items successfully Added !",
           timeout : 1000,
           progressBar:false
        }).show()
    }).catch(err => {
       // show error Notification
       new Noty({
         type:'error',
         text : "Something went Wrong !",
         timeout : 1000,
         progressBar:false
      }).show()
    })
 }

 addCart.forEach(cart => {
    cart.addEventListener('click', (e)=>{
         // console.log(cart.dataset.pizza)
         let pizza = JSON.parse(cart.dataset.pizza);
         // call updateCart(pizza) for updating cart 

         updateCart(pizza);
    })
 })
