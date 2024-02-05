import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branche } from './branche.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {
  data: any
  cities: string[] = [];

  constructor(private http: HttpClient) { }

  getBranches(): Observable<any> {
    const data = this.http.get(`https://mcdonalds-live-engage-api-stage-1.azurewebsites.net/stores.json`)
    return data;
  }

}
