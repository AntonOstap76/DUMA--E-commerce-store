using System;
using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

// class for creating new specification expressions
public class BaseSpecification<T>(Expression<Func<T, bool>> criteria) : ISpecification<T>
{
    
    public Expression<Func<T, bool>> Criteria => criteria;
}
