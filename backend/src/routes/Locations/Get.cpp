#include <string>

#include <neo4j-client.h>

#include "Locations.hpp"
#include "main.hpp"


void routes_Locations_Get(const crow::request& req, crow::response& res) {
    neo4j_result_stream_t* results = neo4j_run(connection, "MATCH (n) RETURN n", neo4j_null);
    if (results == NULL) {
        res.code = 500;
        res.body = "Error running query";
        return;
    }
    
    std::string string = "";
    char bigbuffer[100000];
    while(true) {
        neo4j_result_t *result = neo4j_fetch_next(results);
        if(result == NULL) break;
        neo4j_tostring(neo4j_result_field(result, 0), bigbuffer, 100000);
        string += bigbuffer;
        std::cout << string << "\n";
    }

    res.add_header("Content-Type", "text/json");
    res.body = string;
    res.end();

    // Clean up Neo4j resources
    neo4j_close_results(results);
}