using AlertsApi.Dtos;
using AlertsApi.Hubs;
using AlertsApi.Services;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddSignalR();
builder.Services.AddSingleton<NumberSumService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (ajusta orígenes según tu URL de Angular)
const string MyCors = "_myCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyCors, policy =>
        policy
            .WithOrigins(
                "http://localhost:4307",
                "https://localhost:4307"
                // agrega aquí tu URL de preview: "https://4307-<CODESPACE>.githubpreview.dev"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

var app = builder.Build();

app.UseCors(MyCors);
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Mapear Hub
app.MapHub<AlertsHub>("/hubs/alerts");

// Endpoint: añadir número y notificar total
app.MapPost("/api/numbers/add", async (NumberDto dto, NumberSumService svc, IHubContext<AlertsHub> hub) =>
{
    var total = svc.Add(dto.Value);
    await hub.Clients.All.SendAsync("sumUpdated", total);
    return Results.Ok(new { total });
});

// Endpoint: leer total actual
app.MapGet("/api/numbers/total", (NumberSumService svc) => Results.Ok(new { total = svc.Get() }));

app.Run();
