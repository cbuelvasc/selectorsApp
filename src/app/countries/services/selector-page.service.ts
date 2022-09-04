import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';

import { CountryV3, CountryV2 } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _url: string = 'https://restcountries.com';

  private _regions: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europa',
    'Oceania',
  ];

  public get regiones(): string[] {
    return [...this._regions];
  }

  public get httpParams(): HttpParams {
    return new HttpParams().set('fields', 'cca3,name');
  }

  constructor(private http: HttpClient) {}

  getCountriesByRegion(query: string): Observable<CountryV3[]> {
    return this.http.get<CountryV3[]>(`${this._url}/v3.1/region/${query}`, {
      params: this.httpParams,
    });
  }

  getCountryByCode(query: string): Observable<CountryV2 | null> {
    if (!query) {
      return of(null);
    }
    return this.http.get<CountryV2>(`${this._url}/v2/alpha/${query}`);
  }
  getCountryByCodeWithFilters(query: string): Observable<CountryV2> {
    return this.http.get<CountryV2>(
      `${this._url}/v2/alpha/${query}?fields=name,alpha3Code`
    );
  }

  getCountryByCodes(bordes: string[]): Observable<(CountryV2 | null)[]> {
    if (!bordes) {
      return of([]);
    }
    const requests: Observable<CountryV2 | null>[] = [];

    bordes.forEach((code) => {
      const request = this.getCountryByCode(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }
}
