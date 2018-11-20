import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Utility } from '../../../shared/utility';
import { HttpApiService } from '../../../shared/http-api.service';
import { AddressConstants } from './address.constants';

@Component({
  selector: 'app-address',
  styleUrls: ['./address.component.css'],
  templateUrl: './address.component.html',
  providers: [Utility, HttpApiService]
})

export class AddressComponent implements OnInit {
  public addressData: any = {};
  public countrylist: any = [];
  public stateslist: any = [];
  public districtslist: any = [];
  public citieslist: any = [];
  private userInfo = JSON.parse(localStorage.getItem('userInfo'));
  private addressValidatorOptions: any = {};
private is_costcenter = false;

  constructor(private utility: Utility, private httpApiService: HttpApiService) {
    this.addressData["city_uuid"] = "";
    this.addressData["country_uuid"] = "";
    this.addressData["state_uuid"] = "";
    this.addressData["district_uuid"] = "";
    this.addressData["state_uuid"] = "";
    this.addressData["status"] = "1";
  }


  @Output() submitAddress = new EventEmitter();
  @Output() loaderOutput = new EventEmitter();

  @Input()
  public set submitAddressData(params: any) {
    if (params && params['actionType'].toLowerCase() == "post") {
     // this.onSubmit(params);
    } else if (params && params['actionType'].toLowerCase() == "get") {
      this.getAddressDetails(params)
    } else {
      this.getCountry();
    }

    this.is_costcenter = params.type == "costCentre" ? true : false;
  }

  ngOnInit() {
    //this.setValidation();
  }

  getAddressDetails(params) {
    this.loaderOutput.emit({ 'type': "push" });
    let authEndPoint = "addresses/" + params.uuid + "/" + params.type
    this.httpApiService.get(authEndPoint)
      .then(res => {
        if (res) {
          this.addressData = res;
          if (res.address_master_uuid.length > 0) {
            this.countrylist = res.country_list;
            this.addressData['country_uuid'] = res.country_uuid;
            this.stateslist = res.state_list;
            this.addressData['state_uuid'] = res.state_uuid;
            this.districtslist = res.district_list;
            this.addressData['district_uuid'] = res.district_uuid;
            this.citieslist = res.city_list;
            this.addressData['city_uuid'] = res.city_uuid;
          } else {
            this.getCountry();
            this.addressData['district_uuid'] = "";
            this.addressData['city_uuid'] = "";
          }
          this.loaderOutput.emit({ 'type': "pop" });
        }
      }, err => {
        this.loaderOutput.emit({ 'type': "pop" });
      });
  }

  getCountry() {
    if (this.countrylist.length <= 0) {
      this.loaderOutput.emit({ 'type': "push" });
      this.httpApiService.get(AddressConstants.Get_Country)
        .then(res => {
          if (res != undefined && res != '' && res != null) {
            this.countrylist = res;
            if (this.countrylist.length > 0) {
              this.addressData['country_uuid'] = this.countrylist[0].country_uuid;
              this.getState();
            }
          }
          this.loaderOutput.emit({ 'type': "pop" });
        },
        err => {
          this.loaderOutput.emit({ 'type': "pop" });
        });
    }
  }

  getState() {
    if (this.addressData['country_uuid'].length > 0) {
      this.addressData['state_uuid'] = "";
      this.loaderOutput.emit({ 'type': "push" });
      let url = AddressConstants.Get_State_By_Country + this.addressData['country_uuid'];
      this.httpApiService.get(url)
        .then(res => {
          this.stateslist = res;
          this.loaderOutput.emit({ 'type': "pop" });
        },
        err => {
          this.loaderOutput.emit({ 'type': "pop" });
        });
    }
  }

  getDistrict() {
    if (this.addressData['state_uuid'].length > 0) {
      this.addressData['district_uuid'] = "";
      this.loaderOutput.emit({ 'type': "push" });
      let url = AddressConstants.Get_District_By_State + this.addressData['state_uuid']
      this.httpApiService.get(url)
        .then(res => {
          this.districtslist = res;
          this.loaderOutput.emit({ 'type': "pop" });
        },
        err => {
          this.loaderOutput.emit({ 'type': "pop" });
        });
    }
  }

  getCity() {
    if (this.addressData['district_uuid'].length > 0) {
      this.loaderOutput.emit({ 'type': "push" });
      let url = AddressConstants.Get_City_By_District + this.addressData['district_uuid'];
      this.addressData['city_uuid'] = "";
      this.httpApiService.get(url)
        .then(res => {
          if (res != undefined && res != '' && res != null) {
            this.citieslist = res;
          }
          this.loaderOutput.emit({ 'type': "pop" });          
        },
        err => {
          this.loaderOutput.emit({ 'type': "pop" });
        });
    }
  }

}