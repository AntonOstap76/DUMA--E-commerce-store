using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

// impelentation of generic interface
public class GenericRepository<T>(StoreContext context) : IGenericRepository<T> where T : BaseEntity
{
    // firstly setting the entity and then do the operation I need
    public void Add(T entity)
    {
        
        context.Set<T>().Add(entity);
    }

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        var query = context.Set<T>().AsQueryable();

        query = spec.ApplyCriteria(query);

        return await query.CountAsync();
    }

    public bool Exists(int id)
    {
        return context.Set<T>().Any(x=>x.Id==id);
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await context.Set<T>().FindAsync(id);
    }

    public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
    {
        // return the item in list that matches or default if it not have in database
       return await ApplySpecification(spec).FirstOrDefaultAsync();
    }

    public async Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec)
    {
       return await ApplySpecification(spec).FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<T>> ListAllAsync()
    {
        return await context.Set<T>().ToListAsync();
    }

    public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }

    public async  Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T, TResult> spec)
    {
       return await ApplySpecification(spec).ToListAsync();
    }

    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    //remove saveAllAsync method

    public void Update(T entity)
    {
        context.Set<T>().Attach(entity);
        context.Entry(entity).State=EntityState.Modified;
    }

    //helper method
    private IQueryable<T>ApplySpecification(ISpecification<T> spec)
    {
        return SpesificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
    }

    private IQueryable<TResult>ApplySpecification<TResult>(ISpecification<T, TResult> spec)
    {
        return SpesificationEvaluator<T>.GetQuery<T, TResult>(context.Set<T>().AsQueryable(), spec);
    }

}
