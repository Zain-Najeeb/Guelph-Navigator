cmake_minimum_required(VERSION 3.9.1)
set (CMAKE_CXX_STANDARD 11)
project(GuelphNavigator)

set(CMAKE_BUILD_TYPE Release)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
list(APPEND CMAKE_PREFIX_PATH ${CMAKE_BINARY_DIR})

set(SOURCES
    src/main.cpp
    src/routes/Locations/Get.cpp
    src/routes/Locations/recieve.cpp
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
add_executable(app ${SOURCES})

target_include_directories(app PUBLIC src)
find_package(Crow)

target_link_libraries(app PUBLIC Crow::Crow -L/usr/local/lib -L/opt/homebrew/opt/openssl/lib  -L/opt/homebrew/Cellar/asio/1.26.0/include neo4j-client ssl crypto jsoncpp m)
