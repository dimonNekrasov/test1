import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

const baseURL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  get(url) {
    return this.http.get(`${baseURL}/${url}`).pipe(
      map((response: any) => {
        return {
          meta: {
            offset: response.offset,
            limit: response.limit,
            total: response.total
          },
          data: response.result
        };
      })
    );
  }

  put(body, id?) {
    return this.http.put(`${baseURL}/body?result:=`, body, this.httpOptions);
  }
}
