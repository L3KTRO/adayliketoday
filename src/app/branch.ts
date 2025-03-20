import {wikiSummary} from "wikipedia";
import {signal, WritableSignal} from "@angular/core";

export class Branch {
  concept: string;
  index = signal(0);
  data!: WritableSignal<itemData[]>;

  constructor(concept: string, data: itemData[] | undefined) {
    if (data) {
      data = data.filter((branch) => branch.year != undefined)
      this.data.set(data);
      this.index.set(Math.floor(Math.random() * (this.data.length - 1)));
    }

    this.concept = concept;
  }

  get() {
    return this.data()[this.index()];
  }

  next() {
    if (this.index() < this.data.length - 1) {
      this.index.update(ind => ind + 1);
    }
  }

  prev() {
    if (this.index() > 0) {
      this.index.update(ind => ind - 1);
    }
  }
}

interface itemData {
  text: string;
  pages: Array<wikiSummary>;
  year?: number;
}
