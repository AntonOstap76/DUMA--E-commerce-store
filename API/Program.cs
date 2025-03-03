using API.Middleware;
using API.SignalR;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// creating new service for SQL connection
builder.Services.AddDbContext<StoreContext>(opt=>
{
    
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();

//buid a service for generic repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddCors();

builder.Services.AddSingleton<IConnectionMultiplexer>(config=>
{
    var connString= builder.Configuration.GetConnectionString("Redis") 
    ?? throw new Exception("Can not get redis connection string");
    var configuration = ConfigurationOptions.Parse(connString, true);
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddSingleton<ICartService, CartService>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ICouponService, CouponService>();
// adding signalR service
// don1t need any configuration
builder.Services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
 
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));

//for authentication
app.UseAuthentication();
app.UseAuthorization();

//serve static content
app.UseDefaultFiles();
//for js files
app.UseStaticFiles();

app.MapControllers();

// adjust endpoints
app.MapGroup("api/").MapIdentityApi<AppUser>();

//mapping for signalR
app.MapHub<NotificationHub>("/hub/notifications");

app.MapFallbackToController("Index", "Fallback");

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
