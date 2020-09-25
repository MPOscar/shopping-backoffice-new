import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/backoffice/home', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/backoffice/styles', title: 'Styles',  icon:'ni-planet text-blue', class: '' },
    { path: '/backoffice/brands', title: 'Brands',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/backoffice/collections', title: 'Collections',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/backoffice/shops', title: 'Shops',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/backoffice/deals', title: 'Deals',  icon:'ni-key-25 text-info', class: '' },
    { path: '/backoffice/categories', title: 'Categories',  icon:'ni-circle-08 text-pink', class: '' },
    { path: '/backoffice/releases', title: 'Releases',  icon:'ni-planet text-blue', class: '' },
    { path: '/backoffice/offers', title: 'Offers',  icon:'ni-planet text-blue', class: '' },
    { path: '/backoffice/urls', title: 'Urls',  icon:'ni-planet text-blue', class: '' },
    { path: '/backoffice/tasks', title: 'Tasks',  icon:'ni-planet text-blue', class: '' },
    { path: '/backoffice/blogs', title: 'Blogs',  icon:'ni-planet text-blue', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
