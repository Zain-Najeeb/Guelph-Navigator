#include <string>

#include <neo4j-client.h>

#include "Locations.hpp"

#include <json/json.h>

void recieveJson(const crow::request& req, crow::response& res) {
    std::string body = req.body;
    Json::Value data;
    Json::Reader reader;
    bool parsed_successfully = reader.parse(body, data); 
    if (!parsed_successfully) {
        res.code = 400;
        res.body = "Error parsing request body";
        return;
    }

    std::string location = data["Location"].asString(); 
    std::cout << location << std::endl;
    res.end();
}