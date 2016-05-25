import {Component} from '@angular/core'
import {MdButton} from '@angular2-material/button'
import {MdCard} from '@angular2-material/card'
import {MdInput} from '@angular2-material/input'

@Component({
    selector: 'login',
    templateUrl: 'app/components/login/login.component.html',
    directives: [MdButton, MdCard, MdInput],
    providers: []
})
export class LoginComponent {

}
