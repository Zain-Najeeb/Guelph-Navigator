using GuelphNavigator.Backend.Models;
using GuelphNavigator.Backend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;

namespace GuelphNavigator.Backend.Controllers; 

[ApiController]
[Route("[controller]")]
public class BuildingController : ControllerBase {
	private readonly ILogger<BuildingController>? logger;
	private readonly IDriver driver;

	public BuildingController(ILogger<BuildingController>? logger, IDriver driver) {
		this.logger = logger;
		this.driver = driver;
	}

	[HttpGet]
	[Route("GetBuildings")]
	[ProducesResponseType(typeof(IEnumerable<Building>), StatusCodes.Status200OK)]
	public async Task<ActionResult<IEnumerable<Building>>> Get() {
		await using var session = driver.AsyncSession();

		var buildings = await session.ExecuteReadAsync(async tx => {
			var result = await (await tx.RunAsync(@"
				MATCH (building:BUILDING)
				RETURN building{.*, id:elementId(building)}")).ToListAsync();
			return result.SelectNamed("building").Select(Neo4jResultUtils.BuildingFromDictionary).ToList();
		});
		return Ok(buildings);
	}
}

