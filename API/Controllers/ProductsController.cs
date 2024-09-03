﻿using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
//define that its controller 
[ApiController]
//define the route for requests
[Route("api/[controller]")]
public class ProductsController(IProductRepository repo) : ControllerBase
{
    [HttpGet]
    //actionResult allow to return HTTP responses

    public async Task<ActionResult<IReadOnlyList<Product>>>GetProducts()
    {
        //ok-meet requirements spesified in IReadOnlyList
        return Ok(await repo.GetProductsAsync());
    }

    [HttpGet("{id:int}")]//api/products/id
    public async Task<ActionResult<Product>>GetProduct(int id)
    {
        var product = await repo.GetProductByIdAsync(id);

        //checking for product to not return null 
        if(product==null) return NotFound();

        return product;
    }

    // for creating a product
    [HttpPost]
    public async Task<ActionResult<Product>>CreateProduct(Product product)
    {
        repo.AddProduct(product);

        //cheking if changes could be saved
        if(await repo.SaveChangesAsync())
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
        repo.UpdateProduct(product);

         if(await repo.SaveChangesAsync())
         {
            return NoContent();
         }

        return BadRequest("Problem updating the product ");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetProductByIdAsync(id);

        if(product == null) return NotFound();

        repo.DeleteProduct(product);

         if(await repo.SaveChangesAsync())
         {
            return NoContent();
         }

        return BadRequest("Problem deleting the product ");

    }

    //cheking if product exists
    private bool ProductExists(int id)
    {
        return repo.ProductExists(id);
    }
}
