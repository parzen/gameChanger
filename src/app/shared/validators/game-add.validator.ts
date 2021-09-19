import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class GameAddValidator {
  public minPlayersSmallerEqualMaxPlayers(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const minPlayersControl = formGroup.get('minPlayers');
      const maxPlayersControl = formGroup.get('maxPlayers');

      if (!minPlayersControl || !maxPlayersControl) {
        return null;
      }

      const minPlayersValue = minPlayersControl.value;

      if (!minPlayersValue) {
        return null;
      }

      const maxPlayersValue = maxPlayersControl.value;

      if (!maxPlayersValue) {
        return null;
      }

      if (minPlayersValue > maxPlayersValue) {
        return { minPlayersGreaterMaxPlayers: true };
      }

      return null;
    };
  }

  public minPlayTimeSmallerEqualMaxPlayTime(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const minPlayTimeControl = formGroup.get('minPlayTime');
      const maxPlayTimeControl = formGroup.get('maxPlayTime');

      if (!minPlayTimeControl || !maxPlayTimeControl) {
        return null;
      }

      const minPlayTimeValue = minPlayTimeControl.value;

      if (!minPlayTimeValue) {
        return null;
      }

      const maxPlayTimeValue = maxPlayTimeControl.value;

      if (!maxPlayTimeValue) {
        return null;
      }

      if (minPlayTimeValue > maxPlayTimeValue) {
        return { minPlayTimeGreaterMaxPlayTime: true };
      }

      return null;
    };
  }
}
