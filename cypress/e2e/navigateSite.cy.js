describe('Navigate and guess', () => {
    it('should navigate to about', () => {
        cy.visit('/')

        cy.get('.sidebar').contains('About').click()

        cy.contains('This site uses the Open Library API.')
    }),

    it('should be able to click a button and load new buttons', () => {
        cy.visit('/')

        // wait for loader
        cy.get('.loader').should('not.exist')

        // get guess-buttons
        let buttons = cy.get('.guess-buttons').children()

        buttons.should('have.length', 4)

        buttons.first().click()
        

        // wait for loader
        cy.wait(1000).get('.loader').should('not.exist').

        buttons = cy.get('.guess-buttons').children()

        buttons.should('have.length', 4)
    }),

    it('should be able to switch between different views', () => {
        cy.visit('/home')

        cy.get('nav.big').contains('Anagram').click()

        cy.contains('Guess the author name!')

        cy.get('nav.big').contains('Max 3 errors').click()

        cy.contains("3 wrong guesses and you're out!")        
    })
})