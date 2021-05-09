
import axios from 'axios' 
import Noty from 'noty'
// import axios from 'axios'
import moment from 'moment'

// import { initAdmin } from './admin'

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

 // code for remove order alert message after 2 sec
 const alertMsg = document.getElementById('success-alert');
 if(alertMsg){
    setTimeout(()=>{
       alertMsg.remove();
    },2000)
 }


 // call initAdmin()

    // Admin related client js code 

   
  function initAdmin(){
    // select element of table body
    const orderTableBody = document.querySelector("#orderTableBody");
    //console.log(orderTableBody.innerHTML)

    // create array for all orders
    let orders = [];

    // create markup for table body and initially se to undefined means not initialized
    let markup ;

    // Fetch all data from server regarding all orders using axios client ajax reqquest.

    axios.get('/admin/orders',{
        headers : {
            "X-Requested-With" : "XMLHttpRequest"
        }
    }).then(res => {
      // console.log("data : "+res.data.map(order=> order._id ))
       orders = res.data ;
       markup = generateMarkup(orders);
       orderTableBody.innerHTML = markup ;
    }).catch(err => {
         console.log(err , " Error in axios.get() in /admin/orders")
    })

    // define renderItems() to load all items related to user order
    function renderItems(items){
        let parsedItems = Object.values(items); // return all values in an array
        return parsedItems.map(menuItem => {
            return `
                <p> ${menuItem.item.name} - ${ menuItem.qty } pcs </p>
            `
        }).join('')
    }

    // define generateMarkup function return  html form of table body

    function generateMarkup(orders){
        // iterate orders array and return

        return orders.map(order => {
            // return an object order within table row markup
            return `
            <tr>
                <td class="border px-4 py-2 text-green-900">
                <p> ${order._id} </p>
                <div> ${ renderItems(order.items) } </div>
                </td>

                <td class="border px-4 py-2"> ${order.customerId.name}</td>
                <td class="border px-4 py-2"> ${order.phone}</td>
                <td class="border px-4 py-2"> ${order.address}</td>

                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                      <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${ order._id }"/>

                        <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border
                        border-gray-400 hover:border-gray-500 px-4 py-2 pr-8
                        rounded shadow leading-tight 
                        focus:outline-none  focus:shadow-outline">
                        
                        <option value="order_placed"
                            ${order.status === 'order_placed' ? 'selected' : ''}
                        >  Placed  </option>
                        
                        
                        <option value="confirmed"
                            ${order.status === 'confirmed' ? 'selected' : ''}
                        >  Confirmed  </option>

                        
                        <option value="prepared"
                            ${order.status === 'prepared' ? 'selected' : ''}
                        >  Prepared  </option>

                        
                        <option value="delivered"
                            ${order.status === 'delivered' ? 'selected' : ''}
                        >  Delivered  </option>

                        
                        <option value="completed"
                            ${order.status === 'completed' ? 'selected' : ''}
                        >  Completed  </option>

                        </select>
                      </form>

                      <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path
                              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                  </div>
                  
                    </div>
                </td>

                <td class="border px-4 py-2"> ${moment(order.createdAt).format('hh:mm A')}</td>
            </tr>
        `
        }).join('')
           
    } // ends generateMarkup()

} // ends initAdmin()

 initAdmin();