import {Component} from '@angular/core'
import {Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router'

import {LoginComponent} from './../login/login.component'
import {MdToolbar} from '@angular2-material/toolbar'

@Component({
    selector: 'r8-barz',
    templateUrl: 'app/components/router/router.component.html',
    directives: [ROUTER_DIRECTIVES, MdToolbar],
    providers: [ROUTER_PROVIDERS]
})
@Routes([
    {
        path: '/login',
        component: LoginComponent
    }
])
export class RouterComponent {
    constructor(private router: Router) {

    }
    ngOnInit() {
        this.router.navigate(['/login']);
    }
}
