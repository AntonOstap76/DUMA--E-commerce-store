using System;
using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    // to get the list of orders
    public OrderSpecification(string email) : base(x=>x.BuyerEmail == email)
    {  
    }

//an individual user can request an individual order 
    public OrderSpecification(string email, int id) : base(x=>x.BuyerEmail == email && x.Id ==id)
    {
        
    }
}
