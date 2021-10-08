import { Game } from './../shared/interfaces/game.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'api/games/';

@Injectable({ providedIn: 'root' })
export class PlayService {
  constructor(private http: HttpClient) {}

  play(players: string, maxPlayTime: string, minAge: string) {
    let params = new HttpParams();
    params = params.append('players', players);
    params = params.append('maxPlayTime', maxPlayTime);
    params = params.append('minAge', minAge);
    return this.http
      .get<{ message: string; games: any; dberror: string }>(
        BACKEND_URL + 'play',
        {
          params: params,
        }
      )
      .pipe(
        map((gameData) => {
          return {
            games: gameData.games.map((game: Game | any) => {
              return {
                id: game._id,
                title: game.title,
                imagePath: game.imagePath,
                minPlayers: game.minPlayers,
                maxPlayers: game.maxPlayers,
                minPlayTime: game.minPlayTime,
                maxPlayTime: game.maxPlayTime,
                minAge: game.minAge,
                note: game.note,
                consider: game.consider,
                gameType: game.gameType,
                creator: game.creator,
              };
            }),
          };
        })
      );
  }
}
