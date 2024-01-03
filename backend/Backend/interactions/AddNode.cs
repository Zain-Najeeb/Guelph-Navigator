using GuelphNavigator.Backend.Models;
using Neo4j.Driver;

namespace GuelphNavigator.Backend.interactions;

public class AddNode {
	
	public static async Task addSpot(IDriver _driver, Spot content ) {
		await using (var seesion = _driver.AsyncSession() ?? throw new ArgumentNullException("_driver.AsyncSession()")) {

			var query = "CREATE (n:Node {positionX: $positionX, positionY: $positionY, name: $name, photosphereUrl: $photosphereUrl})";
			var parameters = new
			{
				positionX = content.PositionX,
				positionY = content.PositionY,
				name = content.Name,
				photosphereUrl = content.PhotosphereUrl
			};
			await seesion.RunAsync(query, parameters);
	
		}
	}

	public static async Task addRS(IDriver _driver, string nodeA, string nodeB) {
		await using (var session = _driver.AsyncSession() ?? throw new ArgumentNullException("_driver.AsyncSession()")) {
			var query = "MATCH (a:Node {name: $nodeA}), (b:Node {name: $nodeB}) CREATE (a)-[:RELATIONSHIP_TYPE]->(b)";
			var parameters = new { nodeA, nodeB };

			await session.RunAsync(query, parameters);
		}

	}
}