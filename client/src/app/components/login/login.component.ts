import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {MdButton} from '@angular2-material/button'
import {MdCard} from '@angular2-material/card'
import {MdInput} from '@angular2-material/input'

import {LoginService} from './../../services/login.service'

@Component({
    selector: 'login',
    templateUrl: 'app/components/login/login.component.html',
    directives: [MdButton, MdCard, MdInput],
    providers: [LoginService]
})
export class LoginComponent {
    token: string;
    errorMessage: string;
    constructor(private router: Router,
        private loginService: LoginService) {

    }

    login(username: string, password: string) {
        this.loginService.login(username, password)
            .subscribe(
                token => this.handleToken(token),
                error =>  this.errorMessage = <any>error
            );
    }

    handleToken(token) {
        this.token = token.token.toString();
        localStorage.setItem('token', this.token);
        this.router.navigate('/login/complete');
    }
}
