using System;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
//define that its controller 
[ApiController]
//define the route for requests
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{

    [HttpGet]
    //actionResult allow to return HTTP responses

    public async Task<ActionResult<IReadOnlyList<Product>>>GetProducts(
        [FromQuery]ProductSpecParams specParams)
    {

        var spec = new ProductSpecification(specParams);

        var products = await repo.ListAsync(spec);

        var count = await repo.CountAsync(spec);

        var pagination = new Pagination<Product>(specParams.PageIndex, specParams.PageSize,
                                                count, products);

        //ok-meet requirements spesified in IReadOnlyList
        return Ok(pagination);
    }



    [HttpGet("{id:int}")]//api/products/id
    public async Task<ActionResult<Product>>GetProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        //checking for product to not return null 
        if(product==null) return NotFound();

        return product;
    }

    // for creating a product
    [HttpPost]
    public async Task<ActionResult<Product>>CreateProduct(Product product)
    {
        repo.Add(product);

        //cheking if changes could be saved
        if(await repo.SaveAllAsync())
        {                           //specify the name of the action, also specify the route 
            return CreatedAtAction("GetProduct", new{id=product.Id}, product);
        }

        return BadRequest("Problem creating product");
    }

    //update endpoint
    [HttpPut("{id:int}")]
    public async Task<ActionResult>UpdateProduct(int id, Product product)
    {
        if(product.Id!=id || !ProductExists(id)) 
           return BadRequest("Cannot update this product");

        //tell  entityFramework that the product is  modified
        // context.Entry(product).State=EntityState.Modified;
        repo.Update(product);

         if(await repo.SaveAllAsync())
         {
            return NoContent();
         }

        return BadRequest("Problem updating the product ");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        if(product == null) return NotFound();

        repo.Remove(product);

         if(await repo.SaveAllAsync())
         {
            return NoContent();
         }

        return BadRequest("Problem deleting the product ");

    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>>GetBrands()
    {
       var spec =  new BrandListSpecification();
        return Ok(await repo.ListAsync(spec));

    }

     [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>>GetTypes()
    {
        var spec = new TypeListSpecification();

        return Ok(await repo.ListAsync(spec));
        
    }

    //cheking if product exists
    private bool ProductExists(int id)
    {
        return repo.Exists(id);
    }
}
