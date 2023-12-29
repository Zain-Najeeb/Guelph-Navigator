using backend.nodeProperties;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using backend.Utilities;

namespace backend.Controllers; 

[ApiController]
[Route("[controller]")]
public class SpotController : ControllerBase {
	private readonly ILogger<WeatherForecastController> logger;
	private readonly IDriver driver;

	public SpotController(ILogger<WeatherForecastController> logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}

	[HttpGet]
	[Route("GetSpot")]
	public async Task<IActionResult> Get([FromQuery] int id) {
		await using var session = driver.AsyncSession();

		var spot = await session.ExecuteReadAsync(async tx => {
			var result = await tx.RunAsync(@"
			MATCH (spot:SPOT) WHERE ID(spot) = $id
			MATCH (spot)-[relationships]->(matches)
			RETURN spot, collect(relationships) AS relationships, collect(matches) AS matches", new { id });
			return await result.SelectNamed("spot").Select(  record => new Spot(
				id, record[0]["name"], record[0]["url"], 0, 0, record[1],   record[2]
			)).FirstOrDefaultAsync();
		});

		if (spot == null) {
			return NotFound();
		}

		return Ok(spot);
	}
}