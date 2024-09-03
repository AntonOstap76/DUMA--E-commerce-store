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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
 
var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();
