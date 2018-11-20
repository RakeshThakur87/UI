import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { ProductCategoryDTO } from '../../shared/models/productcategory.model';
import { ProductGroupDTO } from '../../shared/models/productgroup.model';
import { ProductUOMDTO } from '../../shared/models/productuom.model';
import { ProductDTO } from '../../shared/models/product.model';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {
  }
  industry(): Observable<any> {
    return this.http.get(environment.industry);
  }
  InsertProductCategoryData(saveData: ProductCategoryDTO): Observable<any> {
    debugger;
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  InsertProductGroupData(saveData: ProductGroupDTO): Observable<any> {
    const href = `${environment.InsertIndustry}`;
    return this.http.post<any>(href, saveData);//this.httpApiService.post(url, saveData);
  }
  GetIndustryCategoryList(data): Observable<any> {
    const href = `${environment.industryCategoryList}`;
    return this.http.post<any>(href, data);//this.httpApiService.post(url, saveData);
  }
}
