import { Injectable } from '@angular/core';
import { wikiSummary } from "wikipedia";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(data: [
    {
      text: string;
      pages: Array<wikiSummary>;
      year?: number;
    }
  ]) { }
}
