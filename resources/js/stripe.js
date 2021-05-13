import axios from "axios";
import Noty from "noty";
// import axios from 'axios'
import moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import placedOrder from './apiService'
import {CardWidget} from './cardWidget'

export default async function initStripe() {
  // load stripe
  const stripe = await loadStripe(
    "pk_test_51IqEtOSFMiZcXe76MrXn2qTIhVqvUMqurMmtcKJRlTVONngFi79zsapzx77u9mzEm946OVTaGmyKVv5z3VBZijZf00Tp93456O"
  );

  // set card null initially
  let card = null ;  


  const paymentType = document.querySelector("#paymentType");

  if (paymentType) {
    paymentType.addEventListener("change", (e) => {
      if (e.target.value === "card") {
        // display card widget
        card = new CardWidget(stripe) ; // Initialize an object of CardWIdget and refer to card variable.
        card.mountWidget();
      } else {
        card ? card.unMountWidget() : '' ;
      }
    });
  }

  // Ajax call for ordering pizza
  const paymentForm = document.querySelector("#payment-form"); // select /orders form by their id selector from cart.ejs

  // execute code only on cart page for order
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      // apply submit event on form
      e.preventDefault(); // on submit this method prevent bydefault set action to visit
      let formData = new FormData(paymentForm); // FormData is javascript default class.
      //console.log(formData);

      // create an empty object
      let formObject = {};

      // while iterating formData by calling entries() with forEach
      for (let [key, value] of formData.entries()) {
        // formData.entries() return an array with first element key and second is their value.
        //console.log(key, value)
        formObject[key] = value;
      }
      //         console.log(formObject)

      if(!card){
          // AJAX call to place order with COD
          placedOrder(formObject);
          return ;
      }

        //Verify Card

      const token = await card.createToken(); // must use await becoz we createToken() in CardWidget class use await and always return promise.
      // console.log(token)
      formObject.stripeToken = token ? token.id : '' ;
      placedOrder(formObject) ;      
      
    });
  } // Ends if block
}


