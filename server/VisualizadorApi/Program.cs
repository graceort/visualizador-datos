using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// CORS solo para desarrollo (orígenes abiertos)
const string DevCors = "DevCorsPolicy";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(DevCors, policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors(DevCors);
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoint de ejemplo: GET /api/solicitudes
app.MapGet("/api/solicitudes", () =>
{
    var data = new[]
    {
        new { id = 1, cliente = "Ana Pérez",  tipo = "Crédito", estado = "Pendiente" },
        new { id = 2, cliente = "Luis Gómez", tipo = "Cuenta",  estado = "Aprobado"  },
        new { id = 3, cliente = "Carla Díaz", tipo = "Tarjeta", estado = "En revisión" }
    };
    return Results.Ok(data);
})
.WithName("GetSolicitudes");

app.Run();
