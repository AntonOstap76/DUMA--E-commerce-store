using System;
using System.Linq.Expressions;

namespace Core.Interfaces;

// this class created for setting up specification pattern
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria {get;}
}
