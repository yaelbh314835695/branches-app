import { Component, OnInit, ViewChild } from '@angular/core';
import { BranchesService } from '../branches.service';
import { Branche } from '../branche.interface';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';


export interface City {
  city: string
  area: number
}

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  branche: any[] = [];
  cities: City[] = []
  citiesByArea: any = []
  selectedCity: any = '';

  constructor(private branchesService: BranchesService) { }
  
  displayedColumns: string[] = ['StoreID', 'StoreName', 'StoreAddress', 'StorePhone', 'empInNeed', 'empInterview'];
  dataSource: Branche[] = [];
  selectedArea: number = 0;
  
  @ViewChild('matRef') matRef: MatSelect;

  clear() {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  ngOnInit(): void {
    this.getBranches();
  }

  getBranches() {
    this.branchesService.getBranches().subscribe((branchesList) => {
      this.branche = branchesList;
      this.dataSource = this.branche;
      this.getCities();
    });
  }

  getCities() {
    // this.cities = this.branchesService.getcities();
    const tempMap = new Map<string, boolean>();
    this.branche.forEach(branche => {
      if (!tempMap.has(branche.city.trim())) {
        tempMap.set(branche.city.trim(), true);
        this.cities.push({ "city": branche.city.trim(), "area": branche.store_region });
      }
    });
    this.citiesByArea = this.cities;
  }

  onAreaChange(event: any): void {
    this.selectedArea = event.value;
    this.extractCities(this.selectedArea);
  }

  extractCities(area: any): void {
    const tempMap = new Map<string, boolean>();
    this.clear();
    this.citiesByArea=[];
    this.dataSource = [];
    this.selectedCity = '';
    if (area.length) {
      for (let index = 0; index < area.length; index++) {
        this.cities.filter(branche => branche.area == area[index].area).forEach(branche => {
          if (!tempMap.has(branche.city)) {
            tempMap.set(branche.city, true);
            this.citiesByArea.push({ "city": branche.city, "area": branche.area });
            this.branche.forEach(b => {
              if (b.city.includes(branche.city))
                this.dataSource.push(b);
            })
          }
        });
      }
    }
    else {
      this.citiesByArea = this.cities
      this.dataSource = this.branche;
    }
  }

  searchBranche(event: any) {
    const tempMap = new Map<string, boolean>();
    this.dataSource = [];
    this.selectedCity = '';
    let brancheSearch = event.target.value;
    if (brancheSearch) {
      this.branche.filter(branche => branche.store_id == brancheSearch ||
        branche.store_title?.includes(brancheSearch) ||
        branche.store_address?.includes(brancheSearch) ||
        branche.store_phone?.includes(brancheSearch) ||
        branche.emp_in_need?.toString().includes(brancheSearch) ||
        branche.emp_interview?.includes(brancheSearch)).forEach(b => {
          if (!tempMap.has(b.store_id)) {
            tempMap.set(b.city, true);
            this.dataSource.push(b);
          }
        });
    }
    else {
      this.dataSource = this.branche
    }
  }

  onSelectCity(event: any) {
    this.selectedCity = event.value;
    this.dataSource = [];
    this.branche.forEach(b => {
      if (b.city.includes(this.selectedCity)) {
        this.dataSource.push(b);
      }
    })

  }
}


