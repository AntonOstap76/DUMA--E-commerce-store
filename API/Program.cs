using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// creating new service for SQL connection
builder.Services.AddDbContext<StoreContext>(opt=>
{
    
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
 
var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

try
{
     // dispose anythings we used from this scope
    using var scope= app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();

    //create a database if dont already have it and apply any pending migrations
    await context.Database.MigrateAsync();

    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    
   Console.WriteLine(ex);
   throw;
}

app.Run();
