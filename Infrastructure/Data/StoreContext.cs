using System;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Infrastructure.Config;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

// use primary constructor for SQL connection
public class StoreContext(DbContextOptions options) :IdentityDbContext<AppUser>(options)
{
    // specify the name of entity to   EntityFramework 
    // name of property is going to be name of the table inside db server
    public DbSet<Product> Products { get; set; }

    public DbSet<Address> Addresses{ get; set;}

    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // new configuration will apply--
        // to our storeContext(as long as configuration created in Infrastructure assembly)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProductConfiguration).Assembly);
    }
}
