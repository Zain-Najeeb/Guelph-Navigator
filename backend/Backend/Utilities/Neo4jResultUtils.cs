using GuelphNavigator.Backend.Models;
using Neo4j.Driver;
using Newtonsoft.Json.Linq;

namespace GuelphNavigator.Backend.Utilities; 

public static class Neo4jResultUtils {
	
	/// <summary>
	/// Takes an IResultCursor and returns the IAsyncEnumerable of results given a certain name "n".
	/// For example, given a query `MATCH (name) RETURN (name)`, the n parameter will be "name" and the function will return an enumerable of the results.
	/// </summary>
	/// <param name="cursor"></param>
	/// <param name="n"></param>
	/// <returns></returns>
	
	
	public static IEnumerable<Dictionary<string, object>> SelectNamed(this IEnumerable<IRecord> records, string n) {
		return records.Select(record => (Dictionary<string, object>)record[n]);
	}

	public static Spot SpotFromDictionary(Dictionary<string, object> dict) {
		return new Spot(dict["id"].As<string>(), dict["name"].As<string>(), dict["url"].As<string>(), 0, 0,
			dict.ContainsKey("connectedSpots") ? 
				dict["connectedSpots"].As<List<Dictionary<string, object>>>().Select(SpotConnectionFromDictionary).ToArray() : 
				Array.Empty<SpotConnection>());
	}
	static SpotConnection SpotConnectionFromDictionary(Dictionary<string, object> dict) {
		return new SpotConnection(SpotFromDictionary(dict["endSpot"].As<Dictionary<string, object>>()), dict["weight"].As<int>());
	}

	public static Building BuildingFromDictionary(Dictionary<string, object> dict) {
		return new Building(dict["id"].As<string>(), dict["name"].As<string>(), dict["abbreviation"].As<string>(), Array.Empty<Level>());
	}

	public static string RouteJson(IEnumerable<Dictionary<string,object>> path) {
		JObject jsonObject = new JObject();
		int length = 0; 
		var routeList = new List<JObject>();

		foreach (var dictionary in path) {
			var routeObject = new JObject(); 
			foreach (var kvp in dictionary) {
				routeObject[kvp.Key] = JToken.FromObject(kvp.Value);
			}
			routeList.Add(routeObject);
			length++; 
		}

		jsonObject["length"] = length; 
		jsonObject["route"] = new JArray(routeList); 
		string jsonString = jsonObject.ToString();
		return jsonString; 
	}
	
	
}