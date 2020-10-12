const controller = {};
const path = require("path");
const ejs = require("ejs");
const { Console } = require('console');
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
 
const WooCommerce = new WooCommerceRestApi({
    url: "https://localhost/wordpress",
    consumerKey: "ck_f4486bc7ca0a059262b8bc77d257f482bc2f12f3",
    consumerSecret: "cs_95ccc2c7181cd952e90546adb2b6538b7d247acd",
    version: "wc/v3",
    queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});

var idOrder, orders, ordersForDni;
//pagina principal
controller.validate = (req, res) => {
    console.log(req.query.dni);
    // List orders
    WooCommerce.get("orders", {})
    .then((response) => {
        // Successful request
        //console.log("Response Status:", response.status);
        //console.log("Response Data:", response.data);
        orders = response.data;
        // Obtenemos pedidos
        //orders.map(order => console.log(order.meta_data[0].value));
        ordersForDni = orders.filter(order => order.meta_data[0].value == req.query.dni);
        if(ordersForDni.length != 0){
            //document.getElementById('tickets_title').style.display = "block";
        } else {
            res.send(false);
        }
        console.log("Cantidad de tickets encontrados: " + ordersForDni.length);
        // Cantidad de pedidos
        ordersForDni.map((order) => {
            idOrder = order.id;
            order.line_items.map((item) => {
                console.log(item.id + " " + item.name + " " + item.quantity);
                res.render('index', {
                    title: 'Aplicación de gestión de bonos en FisioProyectos.',
                    dni: req.query.dni,
                    items: order.line_items
                  });
            });  
        });
    })
    .catch((error) => {
    // Invalid request, for 4xx and 5xx statuses
    console.log("Response Data:", error.response.data);
    });
  };

  controller.consume = (req, res) => {
    console.log(req.params.id);
    console.log(req.params.quantity);
    var quantity = req.params.quantity - 1;
    console.log(idOrder);
    const data = {
        status:"completed",
        line_items:[{"id":req.params.id,"quantity":quantity}]
    };
    
    WooCommerce.put("orders/" + idOrder, data)
    .then((response) => {
        console.log(response.data);
        res.redirect('/');
    })
    .catch((error) => {
        console.log(error.response.data);
    });

  };
  
  module.exports = controller;