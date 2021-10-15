import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GamesService } from './games.service';

describe('PostService', () => {
  let gameService: GamesService, mockHttp, mockRouter;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('mockHttp', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    mockRouter = jasmine.createSpyObj('mockRouter', ['navigate']);
    gameService = new GamesService(mockHttp, mockRouter);
  });

  describe('deleteGame', () => {
    it('should remove a game', () => {
      mockHttp.delete.and.returnValue(of(false));
      gameService.deleteGame('1024');

      expect(mockHttp.delete).toHaveBeenCalledWith(
        environment.apiUrl + 'api/games/1024'
      );
    });
  });
});
