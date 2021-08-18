import { Game } from '../../shared/interfaces/game.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css']
})
export class GameAddComponent implements OnInit {
  isLoading = false;
  addGameForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addGameForm = this.fb.group({
      id: [null],
      title: [null, Validators.required],
      thumbnail: [null],
      image: [null],
      minPlayers: [1, [Validators.required, Validators.min(1)]],
      maxPlayers: [2, [Validators.required, Validators.min(1)]],
      playingTime: [0, Validators.required],
      minAge: [0, [Validators.required, Validators.min(0)]],
      note: [null],
      gameType: ["boardgame", Validators.required]
    });
  }

  onSubmit() {
    if (!this.addGameForm.valid) {
      return;
    }
    const newGame: Game = {
      id: "",
      title: this.addGameForm.value.title,
      thumbnail: this.addGameForm.value.thumbnail,
      image: this.addGameForm.value.image,
      minPlayers: this.addGameForm.value.minPlayers,
      maxPlayers: this.addGameForm.value.maxPlayers,
      playingTime: this.addGameForm.value.playingTime,
      minAge: this.addGameForm.value.minAge,
      note: this.addGameForm.value.note,
      gameType: this.addGameForm.value.gameType,
      creator: ""

    }
    console.log(newGame);
  }

}
