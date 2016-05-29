import {Component, Input} from '@angular/core'
import {MdCard} from '@angular2-material/card'
import {MdButton} from '@angular2-material/button'

import {Business} from './../../models/business.model'

@Component({
    selector: 'business-component',
    templateUrl: 'app/components/business/business.component.html',
    directives: [MdCard, MdButton],
    providers: []
})
export class BusinessComponent {
    @Input()
    business: Business;
}
