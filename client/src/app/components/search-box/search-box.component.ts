import {Component, Output, EventEmitter, OnInit} from '@angular/core'
import {MdInput} from '@angular2-material/input'

@Component({
    selector: 'search-box',
    templateUrl: 'app/components/search-box/search-box.component.html',
    directives: [MdInput]
})
export class SearchBoxComponent implements OnInit {
    @Output() update = new EventEmitter();

    ngOnInit() {
        this.update.emit('');
    }

    updateInput(value) {
        this.update.emit(value);
    }
}
