import {Component, Input, OnDestroy, OnInit, ResourceStatus, signal, Signal} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  progress = signal(0);
  @Input() status: Signal<ResourceStatus> = signal(ResourceStatus.Loading);

  ngOnInit() {
    this.simulateProgress();
  }

  ngOnDestroy() {
    document.getElementById("bar")!.style.width = "100%";
    document.getElementById("text")!.innerText = "100%";
    this.progress.set(100);
  }

  simulateProgress() {
    const interval = setInterval(() => {
      if (this.status() !== ResourceStatus.Loading) {
        this.progress.set(100);
        clearInterval(interval);
      } else {
        if (this.progress() < 95) {
          this.progress.update(val => val + 1);
        } else {
          clearInterval(interval);
        }
      }
    }, 50);
  }
}
