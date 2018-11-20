import { Component } from '@angular/core';

//import { MENU_ITEMS } from './client-pages-menu';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
})
export class ClientComponent {
  public navItems: any = [];
  public sidebarMinimized = true;
  public menu : any=[];
  public element: HTMLElement = document.body;

  constructor() {
   debugger;
    this.menu = JSON.parse(localStorage.getItem('MenuList'));
   
    // this.navItems =navItems;
    this.getdetail();
    // this.changes = new MutationObserver((mutations) => {
    //   this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    // });

    // this.changes.observe(<Element>this.element, {
    //   attributes: true
    // });
  }
  // MENU_ITEMS1 = JSON.parse(localStorage.getItem('MenuList'));
  // getdetail();
  //menu = MENU_ITEMS1;


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