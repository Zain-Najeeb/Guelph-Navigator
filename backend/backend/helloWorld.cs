using System;
using System.Threading.Tasks;
using Neo4j.Driver;

namespace backend;

public class HelloWorld : IDisposable
{
    private readonly IDriver _driver;

    public HelloWorld(string uri, string userName, string password)
    {
        _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(userName, password));
    }

    public void Dispose()
    {
        _driver?.Dispose();
    }

    public async Task<string> PrintGreetingAsync(string message)
    {
        await using var session = _driver.AsyncSession();
        var result = await session.WriteTransactionAsync(async tx =>
        {
            var query = "CREATE (a:Greeting) " +
                        "SET a.message = $message " +
                        "RETURN a.message + ', from node ' + id(a)";

            var resultAsync = await tx.RunAsync(query, new {message});
            return await resultAsync.SingleAsync();
        });

        return result[0].As<string>();
    }
}

class Program
{
    static async Task Main(string[] args)
    {
        using var test = new HelloWorld("bolt://localhost:7687", "ZainNajeeb", "nadeem123");
        var greeting = await test.PrintGreetingAsync("Hello world");
        Console.WriteLine(greeting);
    }
}
