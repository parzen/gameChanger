it('loads examples', () => {
  cy.visit('/');
  cy.contains('Select and manage your board games');
});
