using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartService cartService,
                             IUnitOfWork unitOfWork) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey= config["StripeSettings:SecretKey"];

        var cart = await cartService.GetCartAsync(cartId);

        if(cart == null) return null;

        var shippingPrice = 0m;

        if(cart.DeliveryMethodId.HasValue){
            var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null) return null;

            shippingPrice = deliveryMethod.Price;
        }
        //validate or update items in the cart
        foreach (var item in cart.Items)
        {
            var productItem = await unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);

            if(productItem == null) return null;

            if(item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            } 
        }

        var service = new PaymentIntentService();
        
        PaymentIntent? intent = null;

        if(string.IsNullOrEmpty(cart.PaymentIntentId))
        {

            //create paymentIntent
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(x=>x.Quantity*(x.Price*100)) 
                + (long)shippingPrice*100,
                Currency="usd",
                PaymentMethodTypes = ["card"]

            };
            intent = await service.CreateAsync(options);

            // update cart with new payment intent id  and secret key created fter create a new payment intent
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else{
            var options = new PaymentIntentUpdateOptions
            {
                 Amount = (long)cart.Items.Sum(x=>x.Quantity*(x.Price*100)) 
                + (long)shippingPrice*100,
            };
            intent = await service.UpdateAsync(cart.PaymentIntentId,options);
        }
        await cartService.SetCartAsync(cart);
        return cart;
    }
}
