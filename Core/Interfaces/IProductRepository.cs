using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IProductRepository
{
    //define what are returning 
    Task<IReadOnlyList<Product>>GetProductsAsync(string? brand, string? type );

    //?-optinal operator specify if method could return product or null
    Task<Product?>GetProductByIdAsync(int id);

    Task<IReadOnlyList<string>>GetBrandsAsync();
    Task<IReadOnlyList<string>>GetTypesAsync();

    void AddProduct(Product product);

    void UpdateProduct(Product product);

    void DeleteProduct(Product product);

    bool ProductExists(int id);

    Task<bool>SaveChangesAsync();
}
