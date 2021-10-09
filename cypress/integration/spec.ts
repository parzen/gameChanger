const DEMO_USER = 'test123@test123.de';
const DEMO_PW = '123456';

describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show title in dashboard', () => {
    cy.contains('Select and manage your board games');
  });

  it('should load dashboard if not logged in and navigate to /games', () => {
    cy.visit('/games');
    cy.url().should('contain', '/auth/login');
    cy.contains('Login');
  });

  it('should be possible to navigate to signup', () => {
    cy.contains('Signup').click();
    cy.url().should('contain', '/auth/signup');
  });

  it('should be possible to navigate to login', () => {
    cy.contains('Login').click();
    cy.url().should('contain', '/auth/login');
  });
});

describe('Signup Module', () => {
  before(() => {
    cy.task('clearUsers');
  });

  beforeEach(() => {
    cy.visit('/');
    cy.get('#headerSignupButton').click();
  });

  it('should be possible to signup', () => {
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#signupButton').click();
    cy.url().should('contain', '/games');
  });

  it('should show error messages if wrong email and password is filled in', () => {
    cy.get('#signupButton').click();
    cy.contains('This field is mandatory.');
    cy.get('#email').type('bla@foo.d');
    cy.get('#password').type('1234');
    cy.get('#signupButton').click();
    cy.contains('Please enter a valid email');
    cy.contains('The minimal length is 6');
  });
});

describe('Login Module', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#headerLoginButton').click();
  });

  it('should be possible to login', () => {
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#loginButton').click();
    cy.url().should('contain', '/games/list');
  });

  it('should be possible to log out after login', () => {
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#loginButton').click();

    cy.get('#headerLogoutButton').click();
    cy.contains('Select and manage your board games');
  });

  it('should show snackbar if wrong credentials are used', () => {
    cy.get('#email').type('invalid@email.de');
    cy.get('#password').type('wrong-password');
    cy.get('#loginButton').click();
    cy.get('.mat-snack-bar-container').contains('Error');
  });

  it('should show error messages if wrong email and password is filled in', () => {
    cy.get('#loginButton').click();
    cy.contains('This field is mandatory.');
    cy.get('#email').type('bla@foo.d');
    cy.get('#password').type('1234');
    cy.get('#loginButton').click();
    cy.contains('Please enter a valid email');
    cy.contains('The minimal length is 6');
  });
});

describe('Game Module', () => {
  before(() => {
    cy.task('clearGames');
    cy.visit('/');
    cy.get('#headerLoginButton').click();
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#loginButton').click();
    cy.url().should('contain', '/games/list');
  });

  it('should be possible to add a game', () => {
    cy.get('#addGameButton').click();
    cy.get('#title').type('Risk');
    cy.get('#search-button').click();
    cy.get(':nth-child(5) > .card').click();
    cy.get('#saveAndCloseButton').click();
    cy.contains('Game added successfully');
    cy.contains('Risk');
  });

  it('should show error message if adding the same game again', () => {
    cy.get('#addGameButton').click();
    cy.get('#title').type('Risk');
    cy.get('#search-button').click();
    cy.get(':nth-child(5) > .card').click();
    cy.get('#saveAndCloseButton').click();
    cy.contains('Adding a game failed!');
  });

  it('should be possible to edit a game title', () => {
    const newTitle = 'New title';
    cy.get('#menuButton0').click();
    cy.get('#editButton0').click();
    cy.url().should('contain', '/edit');
    cy.get('#title').clear();
    cy.get('#title').type(newTitle);
    cy.get('h1').contains(newTitle);
    cy.get('.save-button').click();
    cy.url().should('contain', '/games/list');
    cy.contains(newTitle);
  });

  it('should be possible to delete a game', () => {
    cy.get('#menuButton0').click();
    cy.get('#deleteButton0').click();
    cy.contains('Are you sure you want to delete?');
    cy.get('#yesButton').click();
    cy.contains('No Games added yet');
  });

  it('should be possible to add games via form', () => {
    cy.get('#addGameButton').click();
    cy.get('#toggleFormTypeButton').click();

    cy.get('#title').clear().type('Monopoly');
    cy.get('#imagePath').type(
      'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1543278754636'
    );
    cy.get('#minAge').type('8');
    cy.get('#minPlayers').type('2');
    cy.get('#maxPlayers').clear().type('8');
    cy.get('#minPlayTime').type('40');
    cy.get('#maxPlayTime').clear().type('300');
    cy.get('#saveButton').click();
    cy.contains('Game added successfully');

    cy.get('#title').clear().type('Risk');
    cy.get('#imagePath').type(
      'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559254847937-51zyVWbt8aL.jpg'
    );
    cy.get('#minAge').type('10');
    cy.get('#minPlayers').type('2');
    cy.get('#maxPlayers').clear().type('6');
    cy.get('#minPlayTime').type('120');
    cy.get('#maxPlayTime').clear().type('120');
    cy.get('#saveButton').click();
    cy.contains('Game added successfully');

    cy.get('#title').clear().type('UNO');
    cy.get('#imagePath').type(
      'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1596731709416'
    );
    cy.get('#minAge').type('7');
    cy.get('#minPlayers').type('2');
    cy.get('#maxPlayers').clear().type('10');
    cy.get('#minPlayTime').type('30');
    cy.get('#maxPlayTime').clear().type('30');
    cy.get('#saveButton').click();
    cy.contains('Game added successfully');

    cy.get('#title').clear().type('Taboo');
    cy.get('#imagePath').type(
      'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1559257822286-41hAgBGsaWL.jpg'
    );
    cy.get('#minAge').type('12');
    cy.get('#minPlayers').type('4');
    cy.get('#maxPlayers').clear().type('10');
    cy.get('#minPlayTime').type('20');
    cy.get('#maxPlayTime').clear().type('20');
    cy.get('#saveButton').click();
    cy.contains('Game added successfully');

    cy.get('#title').clear().type('Pictures');
    cy.get('#imagePath').type(
      'https://d2k4q26owzy373.cloudfront.net/350x350/games/uploaded/1570488307577'
    );
    cy.get('#minAge').type('12');
    cy.get('#minPlayers').type('3');
    cy.get('#maxPlayers').clear().type('5');
    cy.get('#minPlayTime').type('30');
    cy.get('#maxPlayTime').clear().type('30');
    cy.get('#consider').click(); // Game not considered in play component
    cy.get('#saveAndCloseButton').click();
    cy.contains('Game added successfully');

    cy.contains('Monopoly');
    cy.contains('Risk');
    cy.contains('UNO');
    cy.contains('Taboo');
    cy.contains('Pictures');
  });
});

describe('Play Module', () => {
  before(() => {
    cy.visit('/');
    cy.get('#headerLoginButton').click();
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#loginButton').click();
    cy.url().should('contain', '/games/list');
  });

  beforeEach(() => {
    cy.get('#headerPlayButton').click();
    cy.url().should('contain', 'play');
  });

  it('should only show Monopoly Risk and UNO with default params', () => {
    cy.get('#getGamesListButton').click();
    cy.get('.title-container').should('contain', 'Monopoly');
    cy.get('.title-container').should('contain', 'Risk');
    cy.get('.title-container').should('contain', 'UNO');
    cy.get('.title-container').should('not.contain', 'Taboo');
    cy.get('.title-container').should('not.contain', 'Pictures');
  });

  it('should show only Taboo with params 5 30 12', () => {
    cy.get('#playerControl').click().get('mat-option').contains('5').click();
    cy.get('#maxPlayControl').click().get('mat-option').contains('30').click();
    cy.get('#minAgeControl').click().get('mat-option').contains('12+').click();
    cy.get('#getRandomGameButton').click();
    cy.get('.title-container').should('contain', 'Taboo');

    cy.get('#getGamesListButton').click();
    cy.get('.title-container').should('contain', 'Taboo');
    cy.get('.title-container').should('not.contain', 'Pictures');
  });
});
