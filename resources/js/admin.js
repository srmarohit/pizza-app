   // Admin related client js code 

import axios from 'axios'
import moment from 'moment'

   
 const initAdmin = () => {
    // select element of table body
    const orderTableBody = document.getElementById('#orderTableBody');

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
        orders = res.data ;
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup ;
    }).catch(err=>{
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
                            class="point-events-none absolute indert-y-0 flex
                            items-center px-2 text-gray-700">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </div>

                    </div>
                </td>

                <td class="border px-4 py-2"> ${moment(order.createdAt).format('hh:mm A')}</td>
            </tr>
        `
        }).join(' ')
           
    } // ends generateMarkup()

} // ends initAdmin()

module.exports = initAdmin ;