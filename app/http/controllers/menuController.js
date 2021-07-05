// Menu Controller handles the callback function of /menus route and display menu.ejs page 
// shows all product with pagination features
// pugin Search bar also .

const Menu = require("../../models/menu");

function menuController(){
    return {
        products : async (req,res) => {
             // Configure Option for menus pagination
            const options = {
                page: req.query.page || 1,
                limit: 3,
               // sort: { date: -1 },
                collation: {
                  locale: 'en',
                },
              };
            const menuItems = await Menu.paginate({}, options);
            if(!menuItems){
                return res.redirect('/')
            }
           // console.log(menuItems)

            return res.render('menus', {menuItems})
        }
    }
}

module.exports = menuController ;