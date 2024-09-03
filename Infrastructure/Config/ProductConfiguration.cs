using System;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Config;

// configuration of the product entity
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        // explicitly define Price property  
        builder.Property(x=>x.Price).HasColumnType("decimal(18,2)");
        builder.Property(x=>x.Name).IsRequired();
       
    }
}
