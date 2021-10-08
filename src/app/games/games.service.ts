import { Game } from './../shared/interfaces/game.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'api/games/';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private games: Game[] = [];
  private gamesUpdated = new Subject<{ games: Game[] }>(); // Subject ist einfache Art eines Observable

  constructor(private http: HttpClient, private router: Router) {}

  getGames() {
    this.http
      .get<{ message: string; games: any; dberror: string }>(BACKEND_URL)
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
      )
      .subscribe((transformedGameData) => {
        this.games = transformedGameData.games;
        this.gamesUpdated.next({
          games: [...this.games],
        });
      });
  }

  getGameUpdateListener() {
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
      consider: Boolean;
      gameType: string;
      creator: string;
    }>(BACKEND_URL + '/game/' + id);
  }

  addGame(
    game: Game
  ): Observable<{ message: string; game: Game; dberror: string }> {
    return this.http.post<{ message: string; game: Game; dberror: string }>(
      BACKEND_URL,
      {
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
      }
    );
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
      consider: game.consider,
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
}
