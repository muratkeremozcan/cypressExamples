describe('Home page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('successfully loads', () => {
        cy.contains('Home');
    });

    it('should show the menu pressing the toggle button', () => {
        cy.get('.scroll-content > .bar-buttons').click();
        cy.get('ion-menu').should('be.visible');
    });

    it('should show the menu pressing the burger menu', () => {
        cy.get('.toolbar > .bar-buttons').click();
        cy.get('ion-menu').should('be.visible');
    })

    it('should hide the menu clicking anywhere outside the menu area', () => {
        cy.get('.toolbar > .bar-buttons').click();
        cy.wait(1000);
        cy.get('ion-backdrop').click();
        cy.get('ion-menu').should('not.be.visible');
    });

    it('should navigate to the Home page from the menu', () => {
        cy.get('.toolbar > .bar-buttons').click();
        cy.wait(1000);
        cy.contains('Home').click();
    });

    it('should navigate to the List page from the menu', () => {
        cy.get('.toolbar > .bar-buttons').click();
        cy.wait(1000);
        cy.contains('List').click();
    });
});