"use strict";

module.exports = function(Order) {
  Order.remoteMethod("placeOrder", {
    http: {
      path: "/:id/placeOrder",
      verb: "get"
    },
    accepts: {
      arg: "id",
      type: "string",
      required: "true"
    },
    returns: {
      arg: "orderStatus",
      type: "string",
      root: "true"
    }
  });

  Order.placeOrder = async function(id) {
    if (!id) return "Please write Order ID";

    var order = await Order.findById(id, {
      include: {
        relation: "orderItems",
        scope: {
          include: {
            relation: "cartItem",
            scope: {
              include: "product"
            }
          }
        }
      }
    });
    if (!order) {
      // console.log("no product in order");
      return "No products to order";
    }

    var totalAmount = 0;
    console.log(order.orderItems());
    console.log(order.orderItems().length);
    console.log(
      order
        .orderItems()[0]
        .cartItem()
        .product()
    );

    for (var i = 0; i < order.orderItems().length; i++) {
      // console.log(`Quantity: ${order.orderItems()[i].quantity} and Price: ${order.orderItems()[i].product().price}`);
      totalAmount +=
        order.orderItems()[i].cartItem().quantity *
        order
          .orderItems()
          [i].cartItem()
          .product().price;
    }
    console.log(totalAmount);

    var credits = await Order.findById(id, {
      include: {
        relation: "user",
        scope: {
          include: "userCredits"
        }
      }
    });
    console.log(credits.user());
    if (credits.user().userCredits().creditAmount >= totalAmount) {
      credits.user().userCredits().creditAmount -= totalAmount;
      credits
        .user()
        .userCredits()
        .updateAttributes({
          creditAmount: credits.user().userCredits().creditAmount
        });
      for (var i = 0; i < order.orderItems().length; i++) {
        try {
          var id = order.orderItems()[i].cartItem().id;
          Order.app.models.CartItem.destroyById(id);
          // order.orderItems().cartItem.destroyById();
        } catch (err) {
          console.log(err);
        }
      }

      // var request = require('request');

      // var headers = {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //     'Postman-Token': '7d075342-bb33-4acc-8b65-3d3151436731',
      //     'cache-control': 'no-cache,no-cache'
      // };

      // var dataString = {
      // "sender": "govind.haldiya@mfine.co",
      // "receivers": [
      //     "govind.haldiya@mfine.co"
      // ],
      // "subject": "Thanks for placing your order",
      // "mailBody": "<div>Your order number is ORDER:0001</div>"
      // };

      // var options = {
      //     url: 'http://localhost:3000/api/comms/Mails/send',
      //     method: 'POST',
      //     headers: headers,
      //     body: dataString
      // };

      // function callback(error, response, body) {
      //     if (!error && response.statusCode == 200) {
      //         console.log(body);
      //     }
      // }

      // request(options);

      // var settings = {
      //     "async": true,
      //     "crossDomain": true,
      //     "url": "https://connect.stripe.com/oauth/token",
      //     "method": "POST",
      //     "headers": {
      //       "content-type": "application/x-www-form-urlencoded",
      //       "cache-control": "no-cache",
      //     },
      //     "data": {
      //       "client_secret": "sk_test_f7PKXx5NRBFG5r41nTrPT7qB",
      //       "code": "\"{AUTHORIZATION_CODE}\"",
      //       "grant_type": "authorization_code"
      //     }
      //   }

      //   $.ajax(settings).done(function (response) {
      //     console.log(response);
      //   });

      return "Order Successfully placed";
    } else {
      return "Not Enough Credits";
    }
  };
};
