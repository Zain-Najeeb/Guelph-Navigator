using backend.nodeProperties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Neo4j.Driver;
using System.Linq;
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
			var result = await tx.RunAsync("MATCH (n:SPOT) WHERE ID(n) = $id RETURN n{.*, id:$id}", new { id });

			return await result.SelectNamed("n").Select(record => new Spot(
				id, record["name"].As<string>(), record["url"].As<string>(), 0, 0
			)).FirstOrDefaultAsync();
		});

		if (spot == null) {
			return NotFound();
		}

		return Ok(spot);
	}
}