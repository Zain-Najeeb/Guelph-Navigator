using System.Collections;
namespace backend.nodeProperties;
//List<(Spot, int)> ConnectedNodes
public record Spot(int Id, string Name, string PhotosphereUrl, int PositionX, int PositionY, dynamic connected, dynamic relationships);