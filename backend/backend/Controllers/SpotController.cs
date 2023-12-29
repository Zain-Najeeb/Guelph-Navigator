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
			var result = await (await tx.RunAsync(@"
				MATCH (spot:SPOT) WHERE id(spot) = $id
				OPTIONAL MATCH (spot)-[r]->(relatedSpot:SPOT)
				WITH spot{.*, id:ID(spot)}, COLLECT(r{.*, endSpot:relatedSpot{.*, id:ID(relatedSpot)}}) AS relationships
				RETURN spot{.*, connectedSpots:relationships} AS result", new { id })).ToListAsync();
			return result.SelectNamed("result").Select(Neo4jResultUtils.SpotFromDictionary).FirstOrDefault();
		});

		if (spot == null) {
			return NotFound();
		}

		return Ok(spot);
	}
}