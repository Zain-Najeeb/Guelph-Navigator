
using GuelphNavigator.Backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using System;
using Neo4j.Driver;

//Temporary controller to add nodes / points

namespace GuelphNavigator.Backend.Controllers;

[ApiController]
[Route("[controller]")]

public class TestingController : ControllerBase {
	
	//to ignore caps. 
	private readonly  Dictionary<string, string> buildingData = new Dictionary<string, string>
	{
		{"rozanski hall", "Rozanski Hall"},
		{"thornbrough building", "Thornbrough Building"},
		{"alexander hall", "Alexander Hall"},
		{"crop science building", "Crop Science Building"},
		{"rutherford family conservatory", "Rutherford Family Conservatory"},
		{"powell building", "Powell Building"},
		{"johnston hall", "Johnston Hall"},
		{"landscape architecture", "Landscape Architecture"},
		{"mackinnon building", "MacKinnon Building"},
		{"macnaughton building", "MacNaughton Building"},
		{"macdonald hall", "Macdonald Hall"},
		{"macdonald institute", "Macdonald Institute"},
		{"macdonald steward hall", "Macdonald Steward Hall"},
		{"massey hall", "Massey Hall"},
		{"mclaughlin library", "McLaughlin Library"},
		{"reynolds building", "Reynolds Building"},
		{"richards building", "Richards Building"},
		{"summerlee science complex", "Summerlee Science Complex"},
		{"war memorial hall", "War Memorial Hall"},
		{"zavitz hall", "Zavitz Hall"},
		{"athletics centre", "Athletics Centre"},
		{"university centre", "University Centre"},
		{"maclachlan building", "MacLachlan Building"}
	};
	private readonly ILogger<BuildingController>? logger;
	private readonly IDriver driver;

	public TestingController(ILogger<BuildingController>? logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}
	[HttpGet]
	[Route("GetElementIDFromName")]
	public async Task<IActionResult> GetElementIdFromName([FromQuery] string name, [FromQuery] string type) {
		if (type.ToLower() == "building") {
			name = buildingData[name.ToLower()];
		}

		type = type.ToUpper(); 
		await using var session = driver.AsyncSession();
		var elementId = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"MATCH (n:" +type + "{name: $name}) RETURN elementId(n) as nodeId"
			, new { name })).SingleAsync();
			return  result["nodeId"];
		});
		return Ok(elementId);
	}
	//returns elementid of new node
	[HttpPost]
	[Route("CreateNode")]
	public async Task<IActionResult> CreateNode([FromQuery] string type, [FromQuery] string name, [FromQuery] string photoSphereUrl, [FromQuery] double lat, [FromQuery] double lng) {
		await using var session = driver.AsyncSession();
		try {
			string cypherQuery = "CREATE (s:" +type.ToUpper() +"{name: $name, photoSphereUrl: $photoSphereUrl, lat: $lat, lng: $lng})";
			var parameters = new { name, photoSphereUrl, lat, lng };
			await session.WriteTransactionAsync(async transaction => {
				 await transaction.RunAsync(cypherQuery, parameters); 
			});
		} catch (Exception ex) {
			return StatusCode(500, $"Error creating node: {ex.Message}");
		}
		var elementId = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"MATCH (n:"+ type.ToUpper() + "{name: $name}) RETURN elementId(n) as nodeId"
				, new { name })).SingleAsync();
			return  result["nodeId"];
		});
		return Ok(elementId);
	}

	[HttpPost]
	[Route("CreateRelationship")]
	public async Task<string> CreateRelationship([FromQuery] string elementId1, [FromQuery] string elementId2) {
		await using var session = driver.AsyncSession();
		(double, double) firstLatLNG = await GetLatLng(elementId1, session);
		(double, double) secondLatLNG = await GetLatLng(elementId2, session);
		
		double weight = CalculateDistance(firstLatLNG.Item1, firstLatLNG.Item2, secondLatLNG.Item1, secondLatLNG.Item2);
		
		var result = await session.WriteTransactionAsync(async tx => {
			var relationshipResult = await (await tx.RunAsync(@"
            MATCH (n)
            WHERE elementId(n) = $elementId1
            MATCH (p)
            WHERE elementId(p) = $elementId2
            CREATE (n)-[:RELATIONSHIP {weight: $weight}]->(p)
            CREATE (p)-[:RELATIONSHIP {weight: $weight}]->(n)",
				new { elementId1, elementId2, weight })).SingleOrDefaultAsync();
			return  "success" ;
		});
		return result;
	}

	private async Task<(double, double)> GetLatLng(string elementId,  IAsyncSession? session ) {
		IEnumerable<Dictionary<string, object>> node  = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"
				MATCH (n)
				WHERE elementId(n) = $elementId
				RETURN {lat: n.lat, lng: n.lng} AS result
				", new { elementId  })).ToListAsync();
			return result.SelectNamed("result");
		});
		double lat = Convert.ToDouble(node.First()["lat"].As<double>());
		double lng = Convert.ToDouble(node.First()["lng"].As<double>());
		return (lat, lng);
	}

	private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2) {
		const double R = 6371; // Earth's radius in kilometers

		double dlat = ToRadians(lat2 - lat1);
		double dlon = ToRadians(lon2 - lon1);

		double a = Math.Sin(dlat / 2) * Math.Sin(dlat / 2) +
		           Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
		           Math.Sin(dlon / 2) * Math.Sin(dlon / 2);

		double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

		double distance = R * c;
		return Math.Round( distance*1000, 2);
	}
	private static double ToRadians(double angle) {
		return angle * (Math.PI / 180);
	}

}