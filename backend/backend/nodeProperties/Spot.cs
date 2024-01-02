using System.Collections;
namespace backend.nodeProperties;
//List<(Spot, int)> ConnectedNodes
public record Spot(string Id, string Name, string PhotosphereUrl, int PositionX, int PositionY, SpotConnection[] connections);

public record SpotConnection(Spot EndSpot, int Weight);

