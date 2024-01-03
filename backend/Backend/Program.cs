using GuelphNavigator.Backend.Controllers;
using Neo4j.Driver;

namespace GuelphNavigator.Backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		_driver = GraphDatabase.Driver("bolt://ec2-18-216-42-153.us-east-2.compute.amazonaws.com:7687", AuthTokens.None);
		var builder = WebApplication.CreateBuilder(args);
		
		// Add services to the container.
		builder.Services.AddSingleton<IDriver>(_driver);
		builder.Services.AddCors(options => {
			options.AddPolicy("AllowSpecificOrigin",
				builder => builder.WithOrigins("http://localhost:3000")
					.AllowAnyHeader()
					.AllowAnyMethod()
					.AllowAnyOrigin());
		});
		
		builder.Services.AddControllers();
		// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddSwaggerGen();

		var app = builder.Build();
		
		
		app.UseCors("AllowSpecificOrigin");
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