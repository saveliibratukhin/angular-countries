import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountriesService } from '../countries.service';
import { Country } from '../countries/Country';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss']
})

export class CountryCardComponent implements OnInit {
  countryCode: string
  country: Country = {
    name: '',
    currency: '',
    code: '',
    phone: '',
    continent: {
      name: ''
    }
  }

  getLangs() {
    let res = ''
    this.country.languages?.map(l => {
      res += l.name + ', '
    })
    return res.substring(0, res.length - 2)
  }

  constructor(private route: ActivatedRoute,
      private countriesService: CountriesService
    ) { 
    this.route.params.subscribe(p =>this.countryCode = p['countryCode'])
   }

  ngOnInit(): void {
    this.countriesService.getCountry(this.countryCode)
    .subscribe(c => this.country = c)
  }

}
