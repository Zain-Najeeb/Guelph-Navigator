using Neo4j.Driver;
using Newtonsoft.Json;
namespace backend.interactions;

public class AddNode {
	
	public static async Task add(IDriver _driver, string name, object content ) {
		await using (var seesion = _driver.AsyncSession() ?? throw new ArgumentNullException("_driver.AsyncSession()")) {
			var json = JsonConvert.SerializeObject(content); 
			var query = "CREATE (n:Node {name: $name, json: $json})";
			var parameters = new { name, json };
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