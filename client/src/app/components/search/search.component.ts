import {Component, OnInit} from '@angular/core'
import {MdButton} from '@angular2-material/button'
import {MdCard} from '@angular2-material/card'
import {MdInput} from '@angular2-material/input'
import {BusinessComponent} from './../business/business.component'
import {SearchBoxComponent} from './../search-box/search-box.component'

import {Business} from './../../models/business.model'
import {SearchService} from './../../services/search.service'
import {SearchPipe} from './../../pipes/search.pipe'

@Component({
    selector: 'search',
    templateUrl: 'app/components/search/search.component.html',
    pipes: [SearchPipe],
    directives: [MdCard, MdInput, MdButton, BusinessComponent, SearchBoxComponent],
    providers: [SearchService]
})
export class SearchComponent implements OnInit {
    businesses: Business[];
    errorMessage: string;
    term: string;
    constructor(private searchService: SearchService) {
        this.term = '';
    }
    ngOnInit() {
        this.getBusinesses();
    }
    getBusinesses() {
        this.searchService.getBusinesses()
            .subscribe(
                businesses => this.businesses = businesses,
                error =>  this.errorMessage = <any>error
            );
    }
}
