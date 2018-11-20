import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { IndustryDTO } from '../../shared/models/industry.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  constructor(private http: HttpClient) {
  }
  GetdataList(): Observable<any> {
    return this.http.get(environment.industry);
  }
  InsertData(saveData: IndustryDTO): Observable<any> {
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(environment.host + href, saveData);//this.httpApiService.post(url, saveData);
  }
  GetIndustryCategoryList(data): Observable<any> {
    const href = `${environment.industryCategoryList}`;
    return this.http.post<any>(environment.host + href, data);//this.httpApiService.post(url, saveData);
  }
}
