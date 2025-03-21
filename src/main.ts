import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


export function blockOverflow() {
  document.body.style.overflow = 'hidden';
}

export function unblockOverflow() {
  document.body.style.overflow = 'auto';
}


interface combinationsColor {
  first: string,
  second: string,
  third: string,
  gradient: string
};

export function getColorByBranch(branchIndex: number): combinationsColor {
  let first_general = "first-general";
  let second_general = "second-general";
  let third_general = "third-general";
  let grandient_general = "gradient-general";

  let first_event = "first-event";
  let second_event = "second-event";
  let third_event = "third-event";
  let grandient_event = "gradient-event";

  let first_birth = "first-birth";
  let second_birth = "second-birth";
  let third_birth = "third-birth";
  let grandient_birth = "gradient-birth";

  let first_death = "first-death";
  let second_death = "second-death";
  let third_death = "third-death";
  let grandient_death = "gradient-death";

  switch (branchIndex) {
    case 0:
      return {
        first: first_event,
        second: second_event,
        third: third_event,
        gradient: grandient_event
      }
    case 1:
      return {
        first: first_birth,
        second: second_birth,
        third: third_birth,
        gradient: grandient_birth
      }
    case 2:
      return {
        first: first_death,
        second: second_death,
        third: third_death,
        gradient: grandient_death
      }
    default:
      return {
        first: first_general,
        second: second_general,
        third: third_general,
        gradient: grandient_general
      }
  }
}
