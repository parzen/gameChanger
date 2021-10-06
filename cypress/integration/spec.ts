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
  beforeEach(() => {
    cy.visit('/');
    cy.get('#headerSignupButton').click();
  });

  // it('should be possible to signup', () => {
  //   cy.get('#email').type(DEMO_USER);
  //   cy.get('#password').type(DEMO_PW);
  //   cy.get('#signupButton').click();
  //   cy.url().should('contain', '/games');
  // });

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

  it('should show be possible to login', () => {
    cy.get('#email').type(DEMO_USER);
    cy.get('#password').type(DEMO_PW);
    cy.get('#loginButton').click();
    cy.url().should('contain', '/games/list');
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

  it('should be possible to switch to play component', () => {
    cy.get('#headerPlayButton').click();
    cy.url().should('contain', 'play');
  });
});
