import { GameAddComponent } from '../game-add/game-add.component';
import { Game } from '../../shared/interfaces/game.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  games: Game[] = [];

  constructor(public dialog: MatDialog) {}

  addGame() {
    const dialogRef = this.dialog.open(GameAddComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onDelete(id: string) {
    console.log('Delete ' + id);
  }

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
