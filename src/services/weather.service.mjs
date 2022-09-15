import got from 'got';

const weatherIcons = {
  '01': '☀️',
  '02': '🌤️',
  '03': '☁️',
  '04': '☁️',
  '09': '🌧️',
  '10': '🌦️',
  '11': '⛈️',
  '13': '❄️',
  '50': '🌫️'
}

const cities = {
	Минск: {
		lat: 53.8980324,
		lon: 27.537188,
	},
	Гомель: {
		lat: 52.4251406,
		lon: 30.8108273,
	},
	Новополоцк: {
		lat: 55.5252142,
		lon: 28.5407815,
	},
	Манчестер: {
		lat: 53.4721442,
		lon: -2.4940432,
	},
	Варшава: {
		lat: 52.2330653,
		lon: 20.9211119,
	},
	Краков: {
		lat: 50.0620889,
		lon: 19.948896,
	},
	Тбилиси: {
		lat: 41.7261016,
		lon: 44.7591917,
	},
	Батуми: {
		lat: 41.6027467,
		lon: 41.5590672,
	},
}

const getWeatherByCoord = async ({lat, lon}) => {
	const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=${process.env.WEATHER_API_KEY}`;
	const res = await got.get(URL).json();
	return res;
};

export const getWeather = async () => { 
	try {
		let weatherText = 'Погода на сегодня:\n\n';

		for (const cityName in cities) {
			const city = cities[cityName];
			const weather = await getWeatherByCoord({lat: city.lat, lon: city.lon});
			const iconCode = weather.weather[0].icon.substring(0,2);
			weatherText += `${cityName}: ${Math.round(weather.main.temp)}℃ ${weather.weather[0].description}  ${weatherIcons[iconCode]} \n`;
		}

		return weatherText;
	} catch (e) {
		console.error(`Error while getting weather: [${e.message}]`);
	}
};