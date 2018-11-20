import { Component } from '@angular/core';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
})

export class SsoComponent {  
  public navItems: any = [];
  public sidebarMinimized = true;
  public menu : any=[];
  public element: HTMLElement = document.body;
  constructor() {   
    debugger;
    this.menu = JSON.parse(localStorage.getItem('MenuList'));
    this.getdetail();
  }
  getdetail() {
    let aaray: any = [];
    let menu = this.menu;
    for (let key in menu) {
      let itemobj = {};
      itemobj["title"] = menu[key].name;
      itemobj["link"] = '/AreaOffice';
      itemobj["icon"] = menu[key].icon;
      if (menu[key].children.length > 0) {
        itemobj["children"] = this.getchildlist(menu[key].children);
      }
      aaray.push(itemobj);
    }
    debugger;
   this.navItems = aaray;
  }

  getchildlist(menu) {
    let menuarr = [];
    for (let key in menu) {
      let itemobj = {};
      itemobj["title"] = menu[key].name;
      itemobj["link"] = menu[key].url;
      itemobj["icon"] = menu[key].icon;
      if (menu[key].children.length > 0) {
        itemobj["children"] = this.getchildlist(menu[key].children);
      }
      menuarr.push(itemobj);
    }
    return menuarr;
  }
}