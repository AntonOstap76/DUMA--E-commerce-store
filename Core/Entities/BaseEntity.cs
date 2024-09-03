using System;

namespace Core.Entities;

// help to not specified Id as a property in every entety
public class BaseEntity
{
    public int Id { get; set; }
}
