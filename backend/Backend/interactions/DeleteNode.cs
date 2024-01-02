using Neo4j.Driver;

namespace GuelphNavigator.Backend.interactions;

public class DeleteNode {
	public static async Task delete(IDriver _driver, string name  ) {
		await using (var seesion = _driver.AsyncSession() ?? throw new ArgumentNullException("_driver.AsyncSession()")) {
			var query = "MATCH (n:Node {name: $name}) DETACH DELETE n";
			var parameters = new { name };
			await seesion.RunAsync(query, parameters);
		}
	}
}