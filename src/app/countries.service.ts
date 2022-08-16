import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Country } from './countries/Country';
import { Injectable } from '@angular/core';

// write a GraphQL query that asks for information (name , capital, etc..) about all countries
const COUNTRIES = gql`
  {
    countries {
      name
      code
      currency
      phone
      continent {
        name
      }
    }
  }
`;

const gqlSelectedCountry = (countryCode: string) => {
  return gql`
  {
    country(code: "${countryCode}") {
      name
      code
      capital
      currency
      phone
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private apollo: Apollo) {}

  getCountries(): Observable<Country[]> {
    return this.apollo
      .watchQuery<any>({
        query: COUNTRIES,
      })
      .valueChanges.pipe(map((result) => result.data.countries));
  }

  getCountry(countryCode: string): Observable<Country> {
    return this.apollo
      .watchQuery<any>({
        query: gqlSelectedCountry(countryCode)
      })
      .valueChanges.pipe(map(res => res.data.country))
  }
}