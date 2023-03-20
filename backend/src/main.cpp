#include <stdio.h>
#include <neo4j-client.h>
#include "crow.h"
#include "main.hpp"
#include "./routes/Locations/Locations.hpp"



neo4j_connection *connection;

int main() {
    neo4j_client_init();

    connection = neo4j_connect("neo4j://neo4j:password@ec2-3-16-78-159.us-east-2.compute.amazonaws.com", NULL, NEO4J_INSECURE);

    if (connection == NULL) {
        neo4j_perror(stderr, errno, "Connection failed");
        return EXIT_FAILURE;
    }
    
    neo4j_result_stream_t *results = neo4j_run(connection, "RETURN 'hello world!'", neo4j_null);
    if (results == NULL) {
        neo4j_perror(stderr, errno, "Failed to run statement");
        return EXIT_FAILURE;
    }

    neo4j_result_t *result = neo4j_fetch_next(results);
    if (result == NULL) {
        neo4j_perror(stderr, errno, "Failed to fetch result");
        return EXIT_FAILURE;
    }


    neo4j_value_t value = neo4j_result_field(result, 0);
    char buf[128];
    neo4j_tostring(value, buf, sizeof(buf));
    if(strcmp(buf, "\"hello world!\"") != 0) {
        printf("%s\n", buf);
        printf("Neo4j result not as expected, database broken I guess\n");
        neo4j_close_results(results);
        neo4j_close(connection);
        neo4j_client_cleanup();
        return EXIT_FAILURE;
    }
    crow::SimpleApp app;

    CROW_ROUTE(app, "/API/json/recieve").methods("GET"_method, "POST"_method)([](const crow::request& req, crow::response& res){recieveJson(req, res);});

    CROW_ROUTE(app,"/API/Locations_new/Get").methods("GET"_method)([](const crow::request& req , crow::response& res) {routes_Locations_Get(req, res);});
    app.port(3000).multithreaded().run(); //Use 3000, as React uses 3000

    neo4j_close_results(results);
    neo4j_close(connection);
    neo4j_client_cleanup();
}