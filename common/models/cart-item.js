`use strict`;

module.exports = function(CartItem) {
  CartItem.observe("before save", async function updateTimestamp(ctx, next) {
    console.log(`ctx ${ctx.Model.modelName}`);
    console.log(`ctx_instance ${ctx.instance}`);
    console.log(`ctx_option ${ctx.options}`);
    if (ctx.instance) {
      ctx.instance.updated = new Date();
      var cartId = ctx.instance.cartId ? ctx.instance.cartId : null;
      if (!cartId) next("No Cart Id found");
      try {
        var cart = await CartItem.app.models.Cart.findById(cartId, {
          include: "items"
        });
      } catch (err) {
        //Error Handling
      }
      var productIndex = cart
        .items()
        .findIndex(
          x => x.productId.toString() == ctx.instance.productId.toString()
        );
      console.log(cart.items());
      if (productIndex == -1) next();
      else {
        await cart
          .items()
          [productIndex].updateAttributes({ quantity: ctx.instance.quantity });
        var err = new Error("Item already exixsts. Updated quantity only");
        err.statusCode = 201;
        next(err);
      }
    } else {
      ctx.data.updated = new Date();
      next();
    }
  });
};
