
using backend.Controllers;
using Neo4j.Driver;
using Microsoft.Extensions.Logging.Abstractions;

namespace backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		_driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("ZainNajeeb", "nadeem123"));
		var builder = WebApplication.CreateBuilder(args);

		// Add services to the container.

		builder.Services.AddSingleton<IDriver>(_driver);

		builder.Services.AddControllers();
		// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		var app = builder.Build();

		// Configure the HTTP request pipeline.
		if (app.Environment.IsDevelopment()) {
			app.UseSwagger();
			app.UseSwaggerUI();
		}

		app.UseHttpsRedirection();

		app.UseAuthorization();

		app.MapControllers();

		app.Run();
		
		
	}
	//adding a node..
}