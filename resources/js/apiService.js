
import axios from 'axios' 
import Noty from 'noty'
// import axios from 'axios'
import moment from 'moment'


export default function placedOrder(formObject){
    axios
        .post("/orders", formObject)
        .then((res) => {
          // place order by axios post
          // show notification
          new Noty({
            type: "success",
            text: res.data.message, // display success message for 1 sec after visit orders page
            timeout: 3000,
            progressBar: false,
          }).show();

          setTimeout(() => {
            window.location.href = "/customer/orders"; // visit orders page after 1 second
          }, 1000);
        })
        .catch((err) => {
             // show notification
          new Noty({
            type: "error",
            text: "All fields required", // display success message for 1 sec after visit orders page
            timeout: 3000,
            progressBar: false,
          }).show();

          console.log("Error in post orders from axios ", err);
        });
}