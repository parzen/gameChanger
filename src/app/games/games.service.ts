import { Game } from './../shared/interfaces/game.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/games/';

// Dependency Injection:
// Anstatt Property und Data Binding kann man ein Service verwenden
// und diesen Service dann mit Dependency Injection bei anderen
// Komponenten verfügbar machen, mit dem Keywoard @Injectable oder
// man schreibt es in providers Array im Modul. Das Keyword providedIn
// heißt, dass es auf root-Level inkludiert wird
@Injectable({ providedIn: 'root' })
export class GamesService {
  private games: Game[] = [];
  private gamesUpdated = new Subject<{ games: Game[] }>(); // Subject ist einfache Art eines Observable

  constructor(private http: HttpClient, private router: Router) {}

  getGames() {
    // Für http braucht man nicht unsubscriben, wird von angular behandelt
    this.http
      .get<{ message: string; games: any }>(BACKEND_URL)
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
                gameType: game.gameType,
                creator: game.creator,
              };
            }),
          };
        })
      )
      .subscribe((transformedGameData) => {
        this.games = transformedGameData.games;
        this.gamesUpdated.next({
          games: [...this.games],
        });
      });
    //return [...this.games]; // array is copied out from games object
  }

  getGameUpdateListener() {
    // wenn man getGames von außen einfach so aufruft, dann bekommt
    // man eine Kopie von games ([...this.games]). Wenn man neue
    // games hinzufügt ändert sich das aber nicht, da man ja nur eine
    // Kopie zurück gibt. Sollte auch so gemacht werden, man sollte
    // nicht die Daten einfach zurückgeben. Deshalb diese Methode
    // auf die man subscriben kann.
    return this.gamesUpdated.asObservable();
  }

  getGame(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      minPlayers: string;
      maxPlayers: string;
      minPlayTime: string;
      maxPlayTime: string;
      minAge: string;
      note: string;
      gameType: string;
      creator: string;
    }>(BACKEND_URL + '/game/' + id);
  }

  addGame(game: Game) {
    this.http
      .post<{ message: string; game: Game }>(BACKEND_URL, {
        title: game.title,
        imagePath: game.imagePath,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        minPlayTime: game.minPlayTime,
        maxPlayTime: game.maxPlayTime,
        minAge: game.minAge,
        note: game.note,
        gameType: game.gameType,
      })
      .subscribe((responseData) => {
        this.router.navigate(['/games/list']);
      });
  }

  updateGame(game: Game) {
    let gameData: Game;
    gameData = {
      id: game.id,
      title: game.title,
      imagePath: game.imagePath,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      minPlayTime: game.minPlayTime,
      maxPlayTime: game.maxPlayTime,
      minAge: game.minAge,
      note: game.note,
      gameType: game.gameType,
      creator: game.creator,
    };
    this.http
      .put(BACKEND_URL + '/' + game.id, gameData)
      .subscribe((response) => {
        this.router.navigate(['/games/list']);
      });
  }

  deleteGame(gameId: string) {
    return this.http.delete(BACKEND_URL + '/' + gameId);
  }

  play(players: string, maxPlayTime: string, minAge: string) {
    let params = new HttpParams();
    params = params.append('players', players);
    params = params.append('maxPlayTime', maxPlayTime);
    params = params.append('minAge', minAge);
    return this.http
      .get<{ message: string; games: any }>(BACKEND_URL + 'play', {params: params})
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
                gameType: game.gameType,
                creator: game.creator,
              };
            }),
          };
        })
      );
  }
}