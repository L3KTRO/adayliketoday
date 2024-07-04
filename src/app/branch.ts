import { wikiSummary } from "wikipedia";

export class Branch {
  public readonly concept!: string;
  index = 0;
  data!: itemData[];

  constructor(concept: string, data: itemData[] | undefined) {
    if (data) {
      this.data = data.filter((branch) => branch.year != undefined);
      this.index = Math.floor(Math.random() * (this.data.length - 1));
    }

    this.concept = concept;
  }

  get() {
    return this.data[this.index];
  }

  getYears() {
    return this.data.map((branch, index) => [branch.year!!, index]);
  }

  next() {
    if (this.index < this.data.length - 1) {
      this.index++;
    }
  }

  prev() {
    if (this.index > 0) {
      this.index--;
    }
  }

  oldest() {
    this.index = this.getYears().sort((a, b) => a[0] - b[0])[0][1];
  }

  newest() {
    this.index = this.getYears().sort((a, b) => b[0] - a[0])[0][1];
  }

}

interface itemData {
  text: string;
  pages: Array<wikiSummary>;
  year?: number;
}
