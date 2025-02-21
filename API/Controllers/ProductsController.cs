using System;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class ProductsController(IUnitOfWork unitOfWork) : BaseApiController
{

    [HttpGet]
    //actionResult allow to return HTTP responses

    public async Task<ActionResult<IReadOnlyList<Product>>>GetProducts(
        [FromQuery]ProductSpecParams specParams)
    {

        var spec = new ProductSpecification(specParams);

        // usage of unitofWork
        return await CreatePagedResult(unitOfWork.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize); 
    }



    [HttpGet("{id:int}")]//api/products/id
    public async Task<ActionResult<Product>>GetProduct(int id)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);

        //checking for product to not return null 
        if(product==null) return NotFound();

        return product;
    }

    // for creating a product
    [HttpPost]
    public async Task<ActionResult<Product>>CreateProduct(Product product)
    {
        unitOfWork.Repository<Product>().Add(product);

        //cheking if changes could be saved
        if(await unitOfWork.Complete())
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
        unitOfWork.Repository<Product>().Update(product);

         if(await unitOfWork.Complete())
         {
            return NoContent();
         }

        return BadRequest("Problem updating the product ");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);

        if(product == null) return NotFound();

        unitOfWork.Repository<Product>().Remove(product);

         if(await unitOfWork.Complete())
         {
            return NoContent();
         }

        return BadRequest("Problem deleting the product ");

    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>>GetBrands()
    {
       var spec =  new BrandListSpecification();
        return Ok(await unitOfWork.Repository<Product>().ListAsync(spec));

    }

     [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>>GetTypes()
    {
        var spec = new TypeListSpecification();

        return Ok(await unitOfWork.Repository<Product>().ListAsync(spec));
        
    }

    //cheking if product exists
    private bool ProductExists(int id)
    {
        return unitOfWork.Repository<Product>().Exists(id);
    }
}
