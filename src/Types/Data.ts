export interface WeatherType {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  coord: {
    lon: number;
    lat: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
}

export interface CountryType {
  name: string;
  capital: string;
  population: number;
}
