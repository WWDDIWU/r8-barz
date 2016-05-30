import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class LoginService {
    constructor (private http: Http) {}
    private loginUrl = 'api/login';  // URL to web API
    login(email: string, password: string): Observable<any> {
        let creds = JSON.stringify({
            'email': email,
            'password': password
        });
        return this.http.post(this.loginUrl, creds)
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
