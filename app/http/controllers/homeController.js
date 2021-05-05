///// Here we created a homeController factory function that returns an object.

const Menu = require('../../models/menu');

const homeController = () =>{

    // it return an object has a callback function of their respective routes.
    return {
        index : async (req,res) => {
            // fetch all pizaa items 
            const pizzas = await Menu.find();
            //console.log(pizzas)
                // Dont use / in front of render path.
            return res.render('index', { pizzas })
        }
    }
}

module.exports = homeController ;