namespace GuelphNavigator.Backend.Models;

public record Spot(string Id, string Name, string PhotosphereUrl, int PositionX, int PositionY, SpotConnection[] connections);

public record SpotConnection(Spot EndSpot, int Weight);

//public record SpotPath(double length, );

