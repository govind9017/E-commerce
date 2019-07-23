"use strict";

module.exports = function(Cart) {
  // Cart.remoteMethod('addToCart', {
  //     "http": {
  //         "verb": "post",
  //         "path": "/:id/add-to-cart"
  //     },
  //     "accepts": [{
  //         arg: "id",
  //         type: "string",
  //     required: true},
  //         {
  //         arg: "payload",
  //         "type": "object",
  //         "http": {
  //             "source": "body"
  //         }
  //     }],
  //     "returns": {
  //         arg: "cart",
  //         "type": "object",
  //         "root": true
  //     }
  // });

  // Cart.addToCart = async function (id, payload) {
  //     //Validate input
  //     console.log(payload);
  //     if (!id) throw 'No Cart ID found';
  //     if (!payload || !payload.productId) {
  //         // console.log(payload.productId);
  //         return true;
  //     }
  //     var cart = await Cart.findById(id,{
  //         "include":[{
  //             "relation":"items",
  //             "scope":{
  //                 include:"product"
  //             }]
  //         }
  //     });

  //     if (!cart) throw 'No Cart found with the given ID';

  //     if(cart){
  //         var productIndex = cart.items().findIndex(x=>x.productId == payload.productId);
  //         // console.log(productIndex);
  //         console.log(cart.items());
  //         if(productIndex == -1) await cart.items.create({productId:payload.productId});
  //         else{
  //             cart.items()[productIndex].quantity += payload.quantity;
  //             cart.items()[productIndex].updateAttributes({quantity:cart.items()[productIndex].quantity++})
  //         }
  //         console.log(cart.items());
  //     }
  // }

  Cart.remoteMethod("amountPayable", {
    http: {
      verb: "get",
      path: "/:id/amountPayable"
    },
    accepts: {
      //multiple argument: array
      arg: "id",
      type: "string",
      required: "true"
    },
    returns: {
      arg: "totalAmount",
      type: "number",
      root: "true"
    }
  });

  Cart.amountPayable = async function(id) {
    if (!id) return "No Cart ID found";
    var cart = await Cart.findById(id, {
      include: {
        relation: "items",
        scope: {
          include: "product"
        }
      }
    });
    if (!cart) {
      // console.log("no product in cart")
      return 0;
    }

    var totalAmount = 0;

    for (var i = 0; i < cart.items().length; i++) {
      // console.log(`Quantity: ${cart.items()[i].quantity} and Price: ${cart.items()[i].product().price}`);
      totalAmount += cart.items()[i].quantity * cart.items()[i].product().price;
    }
    console.log(totalAmount);
    return totalAmount;
  };
};

// Car.afterInitialize = function() {
//     console.log('afterInitialize triggered');
//   };
