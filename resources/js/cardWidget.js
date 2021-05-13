
// create a class CardWidget keep all properties and method regarding Stripe card

export class CardWidget {
    // set null initially
    stripe = null ;
    card = null ;
    
    // set default style property has base css of card
    style = {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
          ":focus": {
            color: "#303238",
          },
        },
      };


      // define constructor to load dependency for CardWidget class
      constructor(stripe){
          this.stripe = stripe ; // set stripe object 
      }

      // Define some method to perform action

      mountWidget(){
        // create stripe element
        const elements = this.stripe.elements();

        // create card using elements
        this.card = elements.create('card', {style : this.style, hidePostalCode : true});
        this.card.mount("#card-element"); // mount this card object to the card-element id selector

      }


      unMountWidget(){
          this.card.destroy(); // remove card from page
      }

      //create Stripe Token 

      async createToken(){
        try{
            const result = await this.stripe.createToken(this.card) ;
            return result.token ;
        } catch(err){
            console.log("Error into create a token for stripe : "+err)
        }
      }


}