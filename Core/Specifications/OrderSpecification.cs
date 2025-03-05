using System;
using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    // to get the list of orders
    public OrderSpecification(string email) : base(x=>x.BuyerEmail == email)
    {  
        AddInclude(x=>x.OrderItems);
        AddInclude(x=>x.DeliveryMethod);
        AddOrderByDescending(x=>x.OrderDate);
    }

//an individual user can request an individual order 
    public OrderSpecification(string email, int id) : base(x=>x.BuyerEmail == email && x.Id ==id)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }

    public OrderSpecification(string paymentIntentId, bool  isPaymentIntent):base(x=>x.PaymentIntentId == paymentIntentId)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }

    public OrderSpecification(OrderSpecParams specParams) : base
    (x=>string.IsNullOrEmpty(specParams.Status) || x.Status == ParseStatus(specParams.Status))
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
        ApplyPaging(specParams.PageSize*(specParams.PageIndex - 1), specParams.PageSize);
        AddOrderByDescending(x=>x.OrderDate);
    }

    // get order by Id
    public OrderSpecification(int id):base(x=>x.Id == id)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }

    // to convert statu
    private static OrderStatus? ParseStatus(string status)
    {
        if(Enum.TryParse<OrderStatus>(status, true, out var result )) return result;
        return null;
    }
    
}
