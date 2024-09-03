using System;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
//define that its controller 
[ApiController]
//define the route for requests
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly StoreContext context;

    //old way for dependency injection
    public ProductsController(StoreContext context)
    {
        this.context = context;
    }


    [HttpGet]
    //actionResult allow to return HTTP responses
    public async Task<ActionResult<IEnumerable<Product>>>GetProducts()
    {
        return await context.Products.ToListAsync();
    }

    [HttpGet("{id:int}")]//api/products/id
    public async Task<ActionResult<Product>>GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        //checking for product to not return null 
        if(product==null) return NotFound();

        return product;
    }

    // for creating a product
    [HttpPost]
    public async Task<ActionResult<Product>>CreateProduct(Product product)
    {
        context.Products.Add(product);

        await context.SaveChangesAsync();

        return product;
    }

    //update endpoint
    [HttpPut("{id:int}")]
    public async Task<ActionResult>UpdateProduct(int id, Product product)
    {
        if(product.Id!=id || !ProductExists(id)) 
           return BadRequest("Cannot update this product");

        //tell  entityFramework that the product is  modified
        context.Entry(product).State=EntityState.Modified;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if(product == null) return NotFound();

        context.Products.Remove(product);

        await context.SaveChangesAsync();

        return NoContent();

    }

    //cheking if product exists
    private bool ProductExists(int id)
    {
        return context.Products.Any(x=>x.Id==id);
    }
}
