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
	
	
}