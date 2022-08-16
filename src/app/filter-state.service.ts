import { Injectable } from '@angular/core';

export interface FilterValues {
  name: string,
  currency: string,
  continent: {
      name: string
  }
  page: number
}

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  
  state: FilterValues = {
    name: '',
    currency: '',
    continent: {
      name: ''
    },
    page: 0
  }

  constructor() { }

  setState(values: FilterValues) {
    this.state = values
  }

  getState() {
    return this.state
  }
}
