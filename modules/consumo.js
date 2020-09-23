// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
 
const WooCommerce = new WooCommerceRestApi({
    url: "https://fisioproyectos.com",
    consumerKey: "ck_15a752038e7711573024d7b5b0776d8847a566e8",
    consumerSecret: "cs_2b9210ab28b998f84ec06d4ef710f8c53dc88c73",
    version: "wc/v3",
    queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
});

/*window.onload = function() {
    //Global vars
    var dni = document.getElementById('dni');
    document.getElementById('tickets_title').style.display = "none";
  };*/

var ordersForDni;

function validate() {
    // List orders
    WooCommerce.get("orders", {})
    .then((response) => {
        // Successful request
        //console.log("Response Status:", response.status);
        //console.log("Response Data:", response.data);
        orders = response.data;
        // Obtenemos pedidos
        ordersForDni = orders.filter(order => order.meta_data[0].value == dni.value);
        if(ordersForDni.length != 0){
            document.getElementById('tickets_title').style.display = "block";
        } else {
            return alert("No tienes bonos disponibles");
        }
        //alert("Cantidad de dni's encontrados: " + ordersForDni.length);
        // Cantidad de pedidos
        ordersForDni.map((order) => {
            order.line_items.map((item) => {
                var ticketsId = item.id;
                var ticketsName = item.name;
                var ticketsQuantity = item.quantity;
                // Recogemos los tickets disponibles
                $('#tickets').html('<br><div class="row"> ' +
                '<div class="col-sm">' + ticketsName + '</div>' +
                '<div class="col-sm">' + ticketsQuantity + '</div>' +
                '<div class="col-sm"><button type="button" class="btn btn-primary" onclick=consume(' + ticketsId + ',\"' +  ticketsName + '\") id="btn_' + ticketsId + '">Consumir</button></div>' +
                '</div>');
            });  
        });
    })
    .catch((error) => {
    // Invalid request, for 4xx and 5xx statuses
    console.log("Response Status:", error.response.status);
    console.log("Response Headers:", error.response.headers);
    console.log("Response Data:", error.response.data);
    }); 
}

var orderModified = "";

function consume(ticketsId, ticketsName) {
    //alert("Ticket ha consumir: " + ticketsName);
    var productId, ticketsQuantity, customer;
    var xhrConsume = new XMLHttpRequest();
    xhrConsume.withCredentials = true;
    xhrConsume.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            orderModified = JSON.parse(xhrConsume.responseText);
            orderModified.line_items.map((item) => {
                productId = item.id;
                ticketsQuantity = item.quantity--;
                //alert(ticketsQuantity);
            });
            customer = orderModified.billing.first_name;
            alert("Bienvenido " + customer + " has consumido tu sesión. Tu bono cuenta ahora con " + ticketsQuantity + " sesiones."); 
        }
    });
    /*var data = {
        "status":"on-hold",
        "line_items":[{"id":productId,"quantity":ticketsQuantity}]
    };*/

    var data = JSON.stringify({"status":"on-hold","line_items":[{"id":3,"quantity":ticketsQuantity}]});

      // Revisar como se hace en velneo.
      alert(ticketsId);
      //xhrConsume.open("PUT", "https://fisioproyectos.com/wp-json/wc/v3/orders/" + ticketsId + "?oauth_consumer_key=ck_15a752038e7711573024d7b5b0776d8847a566e8&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1600186900&oauth_nonce=Z2ZEnMHhkIs&oauth_version=1.0&oauth_signature=Jpc8/zj/++djsbhBHIrE72hFxzs=",data);
      xhrConsume.open("PUT", "https://fisioproyectos.com/wp-json/wc/v3/orders/" + ticketsId + "?oauth_consumer_key=ck_15a752038e7711573024d7b5b0776d8847a566e8&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1600187159&oauth_nonce=mdf2aHJsSAW&oauth_version=1.0&oauth_signature=uT9DFksUNgXFc9Qtew0+Hu64B1E=",data);
      xhrConsume.setRequestHeader("Content-Type", "application/json");
      xhrConsume.send(data);
    //validate();
}

//module.exports = prueba;