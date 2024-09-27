using System;
using System.Linq.Expressions;

namespace Core.Interfaces;

// this class created for setting up specification pattern
public interface ISpecification<T>
{
    // what methods supports via specifications
    Expression<Func<T, bool>>? Criteria {get;}// ability to where expression

    // implementing sorting
    Expression<Func<T, object>>? OrderBy {get;}
    Expression<Func<T, object>>? OrderByDescending {get;}

    bool IsDictinct {get;}

    int Take{get;}
    int Skip{get;}
    bool isPagingEnabled {get;}

    IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

// creating a projection

public interface ISpecification<T, TResult> : ISpecification<T>
{
    Expression<Func<T, TResult>>? Select {get;}
}