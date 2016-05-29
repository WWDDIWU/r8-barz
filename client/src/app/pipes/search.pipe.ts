import {Pipe} from '@angular/core'

@Pipe({
    name: 'search'
})
export class SearchPipe {
    transform(value, [term]) {
        console.log(value);
        console.log(term);
        if(value != null || value != undefined) {
            return value.filter((item) => (item.name.indexOf(term) > -1));
        } else {
            return null;
        }
    }
}
