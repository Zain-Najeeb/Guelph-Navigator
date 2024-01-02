using backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;

namespace backend.Controllers; 

[ApiController]
[Route("[controller]")]
public class BuildingController : ControllerBase {
	private readonly ILogger<WeatherForecastController>? logger;
	private readonly IDriver driver;

	public BuildingController(ILogger<WeatherForecastController>? logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}

	[HttpGet]
	[Route("GetBuildings")]
	public async Task<IActionResult> Get() {
		await using var session = driver.AsyncSession();

		var spot = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"
				MATCH (building:BUILDING)
				RETURN building{.*, id:elementId(building)}")).ToListAsync();
			return result.SelectNamed("building").Select(Neo4jResultUtils.BuildingFromDictionary).ToList();
		});
		return Ok(spot);
	}
}

