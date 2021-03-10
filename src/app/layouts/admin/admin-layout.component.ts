import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { NavItem, NavItemType } from "../../md/md.module";
import { Subscription } from "rxjs/Subscription";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PopStateEvent,
} from "@angular/common";
import "rxjs/add/operator/filter";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import PerfectScrollbar from "perfect-scrollbar";

import { HttpClient } from "@angular/common/http";

import { UserI } from "../../models/user";
import { JwtResponseI } from "../../models/jwt-response";
import { tap } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";

declare const $: any;

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.css"],
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  public navItems: NavItem[];
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: string;
  location: Location;

  @ViewChild("sidebar", { static: false }) sidebar: any;
  @ViewChild(NavbarComponent, { static: false }) navbar: NavbarComponent;
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    location: Location
  ) {
    this.location = location;
  }
  ngOnInit() {
    const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
    const elemSidebar = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });
    const html = document.getElementsByTagName("html")[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      html.classList.add("perfect-scrollbar-on");
    } else {
      html.classList.add("perfect-scrollbar-off");
    }
    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.navbar.sidebarClose();
      });

    this.navItems = [
      {
        type: NavItemType.NavbarLeft,
        title: "Dashboard",
        iconClass: "fa fa-dashboard",
      },

      {
        type: NavItemType.NavbarRight,
        title: "",
        iconClass: "fa fa-bell-o",
        numNotifications: 5,
        dropdownItems: [
          { title: "Notification 1" },
          { title: "Notification 2" },
          { title: "Notification 3" },
          { title: "Notification 4" },
          { title: "Another Notification" },
        ],
      },
      {
        type: NavItemType.NavbarRight,
        title: "",
        iconClass: "fa fa-list",

        dropdownItems: [
          { iconClass: "pe-7s-mail", title: "Messages" },
          { iconClass: "pe-7s-help1", title: "Help Center" },
          { iconClass: "pe-7s-tools", title: "Settings" },
          "separator",
          { iconClass: "pe-7s-lock", title: "Lock Screen" },
          { iconClass: "pe-7s-close-circle", title: "Log Out" },
        ],
      },
      {
        type: NavItemType.NavbarLeft,
        title: "Search",
        iconClass: "fa fa-search",
      },

      { type: NavItemType.NavbarLeft, title: "Account" },
      {
        type: NavItemType.NavbarLeft,
        title: "Dropdown",
        dropdownItems: [
          { title: "Action" },
          { title: "Another action" },
          { title: "Something" },
          { title: "Another action" },
          { title: "Something" },
          "separator",
          { title: "Separated link" },
        ],
      },
      { type: NavItemType.NavbarLeft, title: "Log out" },
    ];
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  public isMap() {
    if (
      this.location.prepareExternalUrl(this.location.path()) ===
      "/maps/fullscreen"
    ) {
      return true;
    } else {
      return false;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }

  condition = true;

  AUTH_SERVER: string = "http://34.70.3.128/customers/ingresar";
  authSubject = new BehaviorSubject(false);
  private token: string;

  login(user: UserI): Observable<JwtResponseI> {
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}`, user).pipe(
      tap((res: JwtResponseI) => {
        if (res.token) {
          // this.router.navigate(['dashboard']);
          this.condition = false;
          localStorage.setItem("auth_token", res.token);
        }
      })
    );
  }

  onLogin(form): void {
    this.login(form.value).subscribe((res) => {
      // this.router.navigateByUrl('/auth/dashboard');
    });
  }

  // logout(): void {
  //   this.token = '';
  //   localStorage.removeItem("ACCESS_TOKEN");
  //   localStorage.removeItem("EXPIRES_IN");
  // }

  // private saveToken(token: string, expiresIn: string): void {
  //   localStorage.setItem("ACCESS_TOKEN", token);
  //   localStorage.setItem("EXPIRES_IN", expiresIn);
  //   this.token = token;
  // }
}
