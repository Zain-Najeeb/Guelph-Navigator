using Neo4j.Driver;
using backend.interactions;
using backend.nodeProperties;
namespace backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		
		_driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("ZainNajeeb", "nadeem123"));
	//	await add();
	//	await DeleteNode.delete(_driver, "tfddfest"); 
//	await add("example");
//	await add("test2");
//	await addRelationship("test1", "test2"); 
	}
	//adding a node..
	public static async Task addSpot(string name) {
		Spot spot = new Spot();
		spot.positionX = 0;
		spot.positionY = 0; 
		spot.photosphereUrl = "test";
		spot.name = name; 
		await AddNode.addSpot(_driver, spot);
	}
	//deleting a node.. 
	public static async Task delete(string name) {
		await DeleteNode.delete(_driver, "tfddfest"); 
	}
	//adding a relationship between two nodes..
	public static async Task addRelationship(string nodeA, string nodeB) {
		await AddNode.addRS(_driver,nodeA, nodeB); 
	}
}