using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SpesificationEvaluator<T> where T : BaseEntity
{
    // creating a method so we can call it without a new instance  spesification evaluator 

    // specify the actual query which will go to database and we return
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> spec)
    {
        if(spec.Criteria!=null)
        {
            query=query.Where(spec.Criteria); // x=>x.Brand==brand
        }


        if(spec.OrderBy!=null)
        {
            query = query.OrderBy(spec.OrderBy);
        }

          if(spec.OrderByDescending!=null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        if(spec.IsDictinct)
        {
            query=query.Distinct();
        }

        if(spec.isPagingEnabled)
        {
            query=query.Skip(spec.Skip).Take(spec.Take);
        }
        
        query = spec.Includes.Aggregate(query,(current,include)=>current.Include(include));
        query = spec.IncludeStrings.Aggregate(query,(current,include)=>current.Include(include));


        return query;
    }

      public static IQueryable<TResult> GetQuery<TSpec, TResult>(IQueryable<T> query,
       ISpecification<T, TResult> spec)
    {
        if(spec.Criteria!=null)
        {
            query=query.Where(spec.Criteria); // x=>x.Brand==brand
        }


        if(spec.OrderBy!=null)
        {
            query = query.OrderBy(spec.OrderBy);
        }

          if(spec.OrderByDescending!=null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        var selectQuery = query as IQueryable<TResult>;

        if(spec.Select != null)
        {
            selectQuery = query.Select(spec.Select);
        }

        if(spec.IsDictinct)
        {
            selectQuery=selectQuery?.Distinct();
        }
        
        if(spec.isPagingEnabled)
        {
            selectQuery=selectQuery?.Skip(spec.Skip).Take(spec.Take);
        }

        return selectQuery ?? query.Cast<TResult>();
    }

}
