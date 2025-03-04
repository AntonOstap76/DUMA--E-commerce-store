using System;
using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context, UserManager<AppUser> userManager)
    {
        // check if there is no user admin in database
        if(!userManager.Users.Any(x=>x.UserName == "admin@test.com"))
        {
            var user = new AppUser
            {
                UserName= "admin@test.com",
                Email="admin@test.com",

            };
            // create a new account
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Admin");
        }
        
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        //for products
        if(!context.Products.Any()){
            //get data from products.json
            var productsData = await File
                            .ReadAllTextAsync(path+ @"/Data/SeedData/products.json");

            //convert data to products
            var products=JsonSerializer.Deserialize<List<Product>>(productsData);

            if(products==null) return;

            context.Products.AddRange(products);

            await context.SaveChangesAsync();
        }
//for delivery
         if(!context.DeliveryMethods.Any()){
            //get data from delivery.json
            var dmData = await File
                            .ReadAllTextAsync(path+ @"/Data/SeedData/delivery.json");

            //convert data to deliverymethods
            var methods =JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

            if(methods==null) return;

            context.DeliveryMethods.AddRange(methods);

            await context.SaveChangesAsync();
        }
    }
}
