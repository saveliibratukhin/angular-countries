import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CountriesService } from '../countries.service';
import { Country } from './Country';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { FilterStateService, FilterValues } from '../filter-state.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = [
    'continent',
    'continentName',
    'phone',
    'phoneNum',
    'currency',
    'currencyName',
  ];


  dataSource = new MatTableDataSource<Country>();

  nameSearchInput = new FormControl('')
  continentRadio = new FormControl('')
  currencySelect = new FormControl('')

  filterValues: FilterValues


  @ViewChild(MatPaginator, {static: false}) set paginator(paginator: MatPaginator){
    this.dataSource.paginator = paginator
  }

  ngAfterViewInit() {
    setTimeout(() => {
        if(this.dataSource.paginator) {
        this.dataSource.paginator.pageIndex = this.filterValues.page
        this.dataSource.paginator.page.next({
          pageIndex: this.dataSource.paginator.pageIndex,
          pageSize: this.dataSource.paginator.pageSize,
          length: this.dataSource.paginator.length
        });
      }
    }, 0)
  }

  getPageNum() {
    return this.dataSource.paginator? this.dataSource.paginator.pageIndex + 1: 1
  }

  nextPage() {
    this.dataSource.paginator?.nextPage()
  }

  prevPage() {
    this.dataSource.paginator?.previousPage()
  }

  constructor(private countriesService: CountriesService,
    private filterStateService: FilterStateService) { 
    this.dataSource.filterPredicate = this.createFilter()
   }
  
  ngOnInit(): void {
    this.countriesService.getCountries().subscribe(countries => {
      this.dataSource.data = countries
    })
    
    this.nameSearchInput.valueChanges.subscribe(val => {
      this.filterValues.name = val?.toLocaleLowerCase() || ''
      this.dataSource.filter = JSON.stringify( this.filterValues)
    })

    this.continentRadio.valueChanges.subscribe(val => {
      const filterValue = val
      this.filterValues.continent.name = filterValue || ''
      this.dataSource.filter = JSON.stringify(this.filterValues)
    })

    this.currencySelect.valueChanges.subscribe(val => {
      this.filterValues.currency = val || ''
      this.dataSource.filter = JSON.stringify(this.filterValues)
    })

    this.filterValues = this.filterStateService.getState()
    this.dataSource.filter = JSON.stringify(this.filterValues)

    this.nameSearchInput.setValue(this.filterValues.name)
    this.continentRadio.setValue(this.filterValues.continent.name)
    this.currencySelect.setValue(this.filterValues.currency)
  }

  ngOnDestroy(): void {
    this.filterValues.page = this.getPageNum() - 1
    this.filterStateService.setState(this.filterValues)
  }

  createFilter(): (data: any, filter: string) => boolean {
    const currencyFilter = (data: any, searchTerms: any): boolean => {
      for (let c of searchTerms.currency) {
        if (data.currency.toLowerCase().indexOf(c) === -1)
         return false
      }
      return true
    }

    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
       && data.continent.name.toLowerCase().indexOf(searchTerms.continent.name) !== -1
       && (data.currency !== null && currencyFilter(data, searchTerms))
    }
    return filterFunction
  }

}