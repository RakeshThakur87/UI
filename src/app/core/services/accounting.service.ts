import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { IndustryDTO } from '../../shared/models/industry.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  constructor(private http: HttpClient) {
  }
  getAccountBookList(): Observable<any> {
    return this.http.get(environment.industry);
  }
  getCostCategorydroplist(): Observable<any> {
    return this.http.get(environment.industry);
  }
  getCostCategoryList(): Observable<any> {
    return this.http.get(environment.industry);
  }
  getCostCenterdroplist(): Observable<any> {
    return this.http.get(environment.industry);
  }
  InsertData(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  InsertCostCategoryData(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  InsertCostCenterData(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  deleteCostCategory(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  deleteCostCenter(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  UpdateCostCategoryData(saveData: IndustryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  GetAccountPagingList(data): Observable<any> {
    const href = `${environment.industryCategoryList}`;
    return this.http.post<any>(href, data);//this.httpApiService.post(url, saveData);
  }
}
