using Neo4j.Driver;
using backend.interactions;
namespace backend;

public class Program {
	private static IDriver _driver;
	public static async Task Main(string[] args) {
		
		_driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("ZainNajeeb", "nadeem123"));
	//	await add();
	//	await DeleteNode.delete(_driver, "tfddfest"); 
	
	}
	
	//adding a node..
	public static async Task add() {
		string test = "tfddfest";
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

	public static async Task delete(string name) {
		await DeleteNode.delete(_driver, "tfddfest"); 
	}
}