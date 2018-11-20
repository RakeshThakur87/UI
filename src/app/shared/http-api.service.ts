
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { config } from './constant';


@Injectable()
export class HttpApiService {
  private config: any = {};

  constructor(public http: Http, private httpclient: HttpClient) {
    this.config.FMS_API_URL = "";
  }

  public handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  public extractData(res: Response) {
    let body = res.json();
    if (body) {
      return body.data || body
    } else {
      return {}
    }
  }

  public get(url, hmac?, acceptType?): Promise<any> {
    hmac = hmac || "";
    acceptType = acceptType || 'application/json';
    // let headers = new Headers();
    // headers.append('Content-Type', "application/x-www-urlencoded','No-Auth':'True");// this.utility.getToken()  || "");
   
    // headers.append('Accept', acceptType || "");
    // let options = new RequestOptions({ headers: headers });
    return this.httpclient.get(config.API_URL + url)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  public post(url, body, hmac?, contentType?): Promise<any> {
    // let headers = new Headers();
    // headers.append('token', "");// this.utility.getToken() || "");
    // headers.append('hmac', hmac || "");
    // headers.append('Content-Type', contentType || "application/json");
    // let options = new RequestOptions({ headers: headers });
    return this.httpclient.post(config.API_URL + url, body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  public put(url, body, hmac?, contentType?): Promise<any> {
    
    let postData = JSON.stringify(body);
    return this.httpclient.put(this.config.API_URL + url, postData)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  public delete(url): Promise<any> {
    return this.httpclient.delete(this.config.API_URL + url)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  userAuthentication(userName, password) {
    var data = "username=" + encodeURI(userName) + "&password=" + encodeURI(password) + "&client_id=" + config.clientId + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'client_role': 'admin','No-Auth':'True' });
    return this.httpclient.post(config.AuthAPI_URL + 'oauth2/token', data, { headers: reqHeader });
  }

  // public getAuthRecord(url, ssotoken) {
  //   let headers = new Headers();
  //   //  headers.append('hmac', hmacc);
  //   headers.append('token', ssotoken);
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get(config.API_URL + url, options)
  //     .map(data => {
  //       if (data.status == 200) {
  //         console.log("success");
  //       }
  //       return JSON.stringify(data);
  //     });
  // }


  getdownloadAsPdf(url): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let opts = new RequestOptions({
      responseType: ResponseContentType.ArrayBuffer
    });
    return this.http.get(config.API_URL + url, opts)
      .toPromise()
      .then((res: any) => {
        debugger;
        let blob = new Blob([res._body], { type: 'application/pdf' });
        return blob;
      })
      .catch(this.handleError)

  }
}
