using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Config;


public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Order> builder)
    {
        // order own this entities
        builder.OwnsOne(x=>x.ShippingAddress, o=>o.WithOwner());
        builder.OwnsOne(x=>x.PaymentSummary, o=>o.WithOwner());

        //for enum
        //to get enum value rather than index of the item in enum list
        builder.Property(x=>x.Status).HasConversion(o=>o.ToString(),
                                                     o=>(OrderStatus)Enum.Parse(typeof(OrderStatus),o));

        builder.Property(x=>x.Subtotal).HasColumnType("decimal(18,2)");

        //one to many relationship
        builder.HasMany(x=>x.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);

        //convert to utc 
        builder.Property(x=>x.OrderDate).HasConversion(d=>d.ToUniversalTime(),
                                                        d=>DateTime.SpecifyKind(d,DateTimeKind.Utc));

        builder.Property(x=>x.Discount).HasColumnType("decimal(18,2)");
        
    }
}
