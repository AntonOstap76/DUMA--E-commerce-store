using System;
using Core.Entities;
using Core.Interfaces;

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


        return query;
    }

}
