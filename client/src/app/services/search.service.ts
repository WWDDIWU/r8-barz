import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Business} from './../models/business.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class SearchService {
    constructor (private http: Http) {}
    private searchUrl = 'app/data/businesses.json';  // URL to web API
    getBusinesses(): Observable<Business[]> {
        return this.http.get(this.searchUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        return res.json() || { };
    }
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
