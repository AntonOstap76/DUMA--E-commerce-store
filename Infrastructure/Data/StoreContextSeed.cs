using System;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        //for products
        if(!context.Products.Any()){
            //get data from products.json
            var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");

            //convert data to products
            var products=JsonSerializer.Deserialize<List<Product>>(productsData);

            if(products==null) return;

            context.Products.AddRange(products);

            await context.SaveChangesAsync();
        }
//for delivery
         if(!context.DeliveryMethods.Any()){
            //get data from delivery.json
            var dmData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");

            //convert data to deliverymethods
            var methods =JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

            if(methods==null) return;

            context.DeliveryMethods.AddRange(methods);

            await context.SaveChangesAsync();
        }
    }
}
