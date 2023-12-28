using Neo4j.Driver;
using backend.interactions;
using backend.nodeProperties;
namespace backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		_driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("ZainNajeeb", "nadeem123"));
		//	await add();
		//	await DeleteNode.delete(_driver, "tfddfest"); 
		//	await add("example");
		//	await add("test2");
		//	await addRelationship("test1", "test2"); 


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
	public static async Task addSpot(string name) {
		// Spot spot = new Spot();
		// spot.PositionX = 0;
		// spot.PositionY = 0; 
		// spot.PhotosphereUrl = "test";
		// spot.Name = name; 
		// await AddNode.addSpot(_driver, spot);
	}
	//deleting a node.. 
	public static async Task delete(string name) {
		await DeleteNode.delete(_driver, "tfddfest"); 
	}
	//adding a relationship between two nodes..
	public static async Task addRelationship(string nodeA, string nodeB) {
		await AddNode.addRS(_driver,nodeA, nodeB); 
	}
}