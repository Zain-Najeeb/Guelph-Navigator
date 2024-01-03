namespace GuelphNavigator.Backend.Models; 

public record Building(string Id, string Name, string Abbreviation, Level[] Levels);

public record Level(string Id, int Number, int Height, Building? Building);
