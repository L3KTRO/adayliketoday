import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WikiHistory} from "../types";

@Injectable({
  providedIn: 'root'
})
export class PullerService {
  constructor(private http: HttpClient) {
  }

  get(url: string) {
    return this.http.get<WikiHistory>(url);
  }
}
