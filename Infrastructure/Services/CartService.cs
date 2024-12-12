using System;
using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

// implementation of ICartService

namespace Infrastructure.Services;

//connect redis
public class CartService(IConnectionMultiplexer redis) : ICartService
{

    private readonly IDatabase _database = redis.GetDatabase();

    public async Task<bool> DeleteCartAsync(string key)
    {
        // when call this method it delete a cart(returns boolean )
        return await _database.KeyDeleteAsync(key);
    }

    public  async Task<ShoppingCart?> GetCartAsync(string key)
    {
        //either return value or null
        var data = await _database.StringGetAsync(key);

        // at this stage data surely not null (data!)

        return data.IsNullOrEmpty ? null: JsonSerializer.Deserialize<ShoppingCart>(data!);
    }

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
    {
        //will either create or update existing cart
        var created = await _database.StringSetAsync(cart.Id,
        //if user create a cart it will disappear in a month
         JsonSerializer.Serialize(cart), TimeSpan.FromDays(30));
        if(!created) return null;

        return await GetCartAsync(cart.Id);
    }
}
