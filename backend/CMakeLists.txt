cmake_minimum_required(VERSION 3.9.1)

project(GuelphNavigator)

set(CMAKE_BUILD_TYPE Release)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
list(APPEND CMAKE_PREFIX_PATH ${CMAKE_BINARY_DIR})

set(SOURCES
    src/main.cpp
    src/routes/Locations/Get.cpp
)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
add_executable(app ${SOURCES})

target_include_directories(app PUBLIC src)
find_package(Crow)
target_link_libraries(app PUBLIC Crow::Crow neo4j-client ssl crypto m)


