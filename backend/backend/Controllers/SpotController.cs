﻿using backend.nodeProperties;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using backend.Utilities;

namespace backend.Controllers; 

[ApiController]
[Route("[controller]")]
public class SpotController : ControllerBase {
	private readonly ILogger<WeatherForecastController>? logger;
	private readonly IDriver driver;

	public SpotController(ILogger<WeatherForecastController>? logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}

	[HttpGet]
	[Route("GetSpot")]
	public async Task<IActionResult> Get([FromQuery] string id) {
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

