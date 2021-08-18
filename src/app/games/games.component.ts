import { Game } from './../shared/interfaces/game.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  games: Game[] = [];

  constructor() {}

  ngOnInit(): void {
    this.games = [
      {
        id: '0',
        title: 'Codenames',
        thumbnail:
          'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__thumb/img/yl8iXxSNwguMeg3KkmfFO9SMVVc=/fit-in/200x150/filters:strip_icc()/pic2582929.jpg',
        image:
          'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__original/img/gcX_EfjsRpB5fI4Ug4XV73G4jGI=/0x0/filters:format(jpeg)/pic2582929.jpg',
        minPlayers: '2',
        maxPlayers: '8',
        playingTime: '15',
        minAge: '14',
        note: 'Am besten ab vier Spieler',
        gameType: 'Boardgame',
      },
      {
        id: '1',
        title: 'Risk',
        thumbnail:
          'https://cf.geekdo-images.com/Oem1TTtSgxOghRFCoyWRPw__thumb/img/5cltSV60oVvjL3Ag_KTJbmTdU6w=/fit-in/200x150/filters:strip_icc()/pic4916782.jpg',
        image:
          'https://cf.geekdo-images.com/Oem1TTtSgxOghRFCoyWRPw__original/img/Nu3eXPyOkhtnR3hhpUrtgqRMAfs=/0x0/filters:format(jpeg)/pic4916782.jpg',
        minPlayers: '2',
        maxPlayers: '6',
        playingTime: '120',
        minAge: '10',
        note: '',
        gameType: 'Boardgame',
      },
    ];
  }
}
