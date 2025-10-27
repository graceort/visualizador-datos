@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getCovidStats() {
    return this.http.get('https://api.covid19api.com/summary');
  }

  getCryptoPrices() {
    return this.http.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  }

  getWeather(city: string) {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=TU_API_KEY`);
  }
}

