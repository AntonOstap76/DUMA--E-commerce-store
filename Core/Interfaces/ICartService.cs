using System;
using Core.Entities;

namespace Core.Interfaces;

public interface ICartService
{
    //get a shopcart using key parametr in redis database
     Task<ShoppingCart?> GetCartAsync(string key);

     Task<ShoppingCart?> SetCartAsync(ShoppingCart cart);

     Task<bool>DeleteCartAsync(string key);


}
