using System;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(ICartService cartService, IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var email = User.GetEmail();

        var cart =  await cartService.GetCartAsync(orderDto.CartId);

        if(cart == null) return BadRequest("Can not found cart");

        if (cart.PaymentIntentId == null) return BadRequest("No payment intent for this order");

        var items = new List<OrderItem>();


        foreach (var item in cart.Items)
        {
            var productItem = await unitOfWork.Repository<Product>().GetByIdAsync(item.ProductId);

            if (productItem == null) return BadRequest("Problem with the order");

            var itemOrdered = new ProductItemOrdered
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                PictureUrl = item.PictureUrl
            };

            var orderItem =  new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = item.Price,
                Quantity = item.Quantity
            };

            items.Add(orderItem);
        }


        var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(orderDto.DeliveryMethodId);

        if(deliveryMethod == null) return BadRequest("Not delivery method selected");

        var order = new Order
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderDto.ShippingAddress, 
            Subtotal = items.Sum(x=>x.Price * x.Quantity),
            PaymentSummary = orderDto.PaymentSummary,
            PaymentIntentId  = cart.PaymentIntentId,
            BuyerEmail = email
        };
        // to track work
        unitOfWork.Repository<Order>().Add(order);

        if(await unitOfWork.Complete()) 
        {
            return order;
        }
        return BadRequest("Problem creating order");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Order>>> GetOrdersForUser()
    {
        var spec = new OrderSpecification(User.GetEmail());

        var orders = await unitOfWork.Repository<Order>().ListAsync(spec);

        return Ok(orders);

    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrderById(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(), id);

        var order = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        if(order == null) NotFound();

        return order;
    }
}