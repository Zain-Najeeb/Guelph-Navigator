namespace GuelphNavigator.Backend.Models;

public record Spot(string Id, string Name, string PhotosphereUrl, double PositionX, double PositionY, SpotConnection[] connections);

public record SpotConnection(Spot EndSpot, int Weight);
