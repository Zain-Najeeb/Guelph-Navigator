using GuelphNavigator.Backend.Models;
using GuelphNavigator.Backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;

namespace GuelphNavigator.Backend.Controllers; 

[ApiController]
[Route("[controller]")]
public class SpotController : ControllerBase {
	private readonly ILogger<SpotController>? logger;
	private readonly IDriver driver;

	public SpotController(ILogger<SpotController>? logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}

	[HttpGet]
	[Route("GetSpot")]
	[ProducesResponseType(typeof(Spot), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<Spot>> Get([FromQuery] string id) {
		await using var session = driver.AsyncSession();

		var spot = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"
				MATCH (spot:SPOT) WHERE elementId(spot) = $id
				OPTIONAL MATCH (spot)-[r]->(relatedSpot:SPOT)
				WITH spot{.*, id:elementId(spot)}, COLLECT(r{.*, endSpot:relatedSpot{.*, id:elementId(relatedSpot)}}) AS relationships
				RETURN spot{.*, connectedSpots:relationships} AS result", new { id })).ToListAsync();
			return result.SelectNamed("result").Select(Neo4jResultUtils.SpotFromDictionary).FirstOrDefault();
		});
		if (spot == null) {
			return NotFound();
		}
		return Ok(spot);
	}

	[HttpGet]
	[Route("GetFastestPathPoints")]
	public async Task<IActionResult> GetFastestPathPoints([FromQuery] string start, [FromQuery] string end) {
		await using var session = driver.AsyncSession();
		var spot = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"
		    MATCH (start:POINT {name: $start}),
		          (end:POINT {name: $end}),
		          p = shortestPath((start)-[:RELATIONSHIP*]-(end))
		    WITH nodes(p) AS spots
		    LIMIT 1
		    UNWIND spots AS spot
		    RETURN spot{.*, id:elementId(spot)} AS result", new { start, end })).ToListAsync();
			return Neo4jResultUtils.RouteJson(result.SelectNamed("result"));
		});
		if (spot == null) {
			return NotFound();
		}
		return Ok(spot);
	}
}

