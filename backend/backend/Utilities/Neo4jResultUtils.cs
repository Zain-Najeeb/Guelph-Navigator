using System.Collections.Generic;
using System.Linq;
using Neo4j.Driver;

namespace backend.Utilities; 

public static class Neo4jResultUtils {
	
	/// <summary>
	/// Takes an IResultCursor and returns the IAsyncEnumerable of results given a certain name "n".
	/// For example, given a query `MATCH (name) RETURN (name)`, the n parameter will be "name" and the function will return an enumerable of the results.
	/// </summary>
	/// <param name="cursor"></param>
	/// <param name="n"></param>
	/// <returns></returns>
	
	
	public static IAsyncEnumerable<List<dynamic>> SelectNamed(this IResultCursor cursor, string n) {
		return cursor.Select(record => {
			var node = (INode)record[n];
	
			var connectedNodes = ((IEnumerable<object>)record["matches"]).Cast<INode>();
			var relationship =((IEnumerable<object>)record["relationships"]).Cast<IRelationship>();
			Dictionary<string, object> dictNode = node.Properties.ToDictionary(entry => entry.Key , entry => entry.Value);
			List<Dictionary<string, object>> dictConnected = connectedNodes.Select(con => con.Properties.ToDictionary(entry => entry.Key, entry => entry.Value)).ToList(); 
			List<Dictionary<string, object>> dictRelationship = relationship.Select(rel => rel.Properties.ToDictionary(entry => entry.Key, entry => entry.Value)).ToList();
			List<dynamic> content = new List<dynamic> {
				dictNode,
				dictConnected,
				dictRelationship
			};
			return content; 
		});
	}
}