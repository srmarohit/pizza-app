
import axios from 'axios' 
import Noty from 'noty'
// import axios from 'axios'
import moment from 'moment'
import mobNav from './mobNav'


 import initAdmin  from './admin.js'
 import initStripe from './stripe.js'

// create action on add cart button
 let addCart = document.querySelectorAll('.add-to-cart');  // return array
 // let cartCounter = document.querySelector('#cartCounter') // cart icon

 //create updateCart()
 function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res => {
        //console.log(res) 
        cartCounter.innerText = res.data.totalQty ; //instad this we fetch data from session

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


 //create removeCartItem()
 let removeItem = document.querySelectorAll(".trash-item");

  function removeCartItem(pizza_id){
   axios.post('/remove-cart-item', {pizza_id}).then(res => {
       //console.log(res) 
       cartCounter.innerText = res.data.totalQty ; //instad this we fetch data from session

       // show notification 
       new Noty({
          type:'success',
          text : "Items successfully Deleted !",
          timeout : 1000,
          progressBar:false
       }).show()

    location.reload()
   
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

removeItem.forEach(item => {
   item.addEventListener('click', (e)=>{
         console.log(item.dataset.pizzaid)
        let id = item.dataset.pizzaid;
        // call updateitem(pizza) for updating item 
        removeCartItem(id)
   })
})

// Increment cart
let increment = document.querySelectorAll(".increment")
let decrement = document.querySelectorAll(".decrement")
let qty = document.querySelectorAll(".qty")
let price = document.querySelectorAll(".price")
let amount = document.querySelector(".amount")

increment.forEach((inc,i) => {
   inc.addEventListener("click", (e)=>{
      axios.post('/update-qty', {changeType : "increment", pizza_id : inc.dataset.pizzaid}).then(res => {
         cartCounter.innerText = res.data.totalQty ; //instad this we fetch data from session
         qty[i].innerText = res.data.pizza_qty+" Pcs" ;
         price[i].innerText = "$"+res.data.pizza_price ;
         amount.innerText = "$"+res.data.totalPrice;
      }).catch(err => {
         // show error Notification
         new Noty({
           type:'error',
           text : "Something went Wrong !",
           timeout : 1000,
           progressBar:false
        }).show()
      })
   })   
})

decrement.forEach((dec,i) => {
   dec.addEventListener("click", (e)=>{
      axios.post('/update-qty', {changeType : "decrement", pizza_id : dec.dataset.pizzaid}).then(res => {
         cartCounter.innerText = res.data.totalQty ; //instad this we fetch data from session
         qty[i].innerText = res.data.pizza_qty+" Pcs" ;
         price[i].innerText = "$"+res.data.pizza_price ;
         amount.innerText = "$"+res.data.totalPrice;
      }).catch(err => {
         // show error Notification
         new Noty({
           type:'error',
           text : "Something went Wrong !",
           timeout : 1000,
           progressBar:false
        }).show()
      })
   })   
})


 
 // code for remove order alert message after 2 sec
 const alertMsg = document.getElementById('success-alert');
 if(alertMsg){
    setTimeout(()=>{
       alertMsg.remove();
    },2000)
 }


 // update status of order

 let statuses = document.querySelectorAll('.status_line'); // return all status list in an array

 let hiddenInput = document.querySelector("#hiddenInput") ;
 let order = hiddenInput ? hiddenInput.value : null ;
 order = JSON.parse(order)

 //console.log(order)

 // create dynamically a small tag to show time
 let small = document.createElement('small'); 

 function updateStatus(order) {
          // first rremove step-completed and current classes from statuses
           statuses.forEach(status => {
              status.classList.remove('step-completed')
              status.classList.remove('current')
           })

          // now set stepcompleted to true 
     let stepCompleted = true ;
     statuses.forEach(status => {
        let dataProp = status.dataset.status ; // return data-status value 
        // Actualy our first time status order_placed bydefault completed therefore we set stepCompleted is true for first status
        // Apply condition to check stepCompleted
           if(stepCompleted){
              status.classList.add('step-completed') ; // so applied here this class to make it gray
           }

           // check if another status is complete or not
            if(dataProp === order.status){
                   stepCompleted = false ; 
                   small.innerText = moment(order.updatedAt).format('hh:mm A');
                   status.append(small)
                if(status.nextElementSibling){
                 // matched
                 status.nextElementSibling.classList.add('current'); // their next li item to make into primary color.
                }
            }
     })
 }

 mobNav(); 

 updateStatus(order);

 initStripe();


 // CLient side Scoeket Initialization
  let socket = io();

  
 let adminPath = window.location.pathname ; // provide path name of page
 // console.log(pathname)   // /admin/orders

 if(adminPath.includes('admin')){ // if url includes admin it means this is admin site
   // call initAdmin()
    // Admin related client js code execute when admin related page loads
 
  initAdmin(socket);

  // create Room for admin order Controller 
    socket.emit('join', 'adminRoom');    // set only one room for admin
 }


 
  // emit to join for new connection 
  if(order){
   socket.emit('join',`order_${order._id}`)
  }

  socket.on('orderUpdated',(data)=>{ // orderUpdated comes from server.js file
      const updatedOrder = { ...order }
      updatedOrder.updatedAt = moment().format();
      updatedOrder.status = data.status ;
     // console.log(data); //display data at client console at real time without refreshing
  
         // call updateStatus and pass updateOrder
         updateStatus(updatedOrder);

           // show notification 
        new Noty({
         type:'success',
         text : "Items successfully Updated !",
         timeout : 3000,
         progressBar:false
      }).show()

   })


   