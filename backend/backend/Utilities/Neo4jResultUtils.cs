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
	public static IAsyncEnumerable<Dictionary<string, object>> SelectNamed(this IResultCursor cursor, string n) {
		return cursor.Select(record => (Dictionary<string, object>)record[n]);
	}
}