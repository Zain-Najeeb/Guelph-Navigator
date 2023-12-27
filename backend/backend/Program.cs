using Neo4j.Driver;
using backend.interactions;
namespace backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		
		_driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("ZainNajeeb", "nadeem123"));
	//	await add();
	//	await DeleteNode.delete(_driver, "tfddfest"); 
	await add("test1");
	await add("test2");
	await addRelationship("test1", "test2"); 
	}
	//adding a node..
	public static async Task add(string name) {
		string test = name;
		string jsonString = @"
		{	
		    ""content"": {
		        ""category"": ""room"",
		        ""level"": 4,
		        ""spot"": {
		            ""name"": ""zain"",
		            ""location"": { ""x"": 100, ""y"": 100 }
		        }
		    }
		}";
		await AddNode.add(_driver, test ,jsonString);
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