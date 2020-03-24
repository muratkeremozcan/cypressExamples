const userEmail = 'email.abcdefg@mailosaur.io'

describe('Reset password flow', () => {

  it('Should receive an email and use reset password link', () => {

    // trigger reset password for user
    // this command is equal to clicking „I forgot my password“ link and entering user email
    cy
      .userPasswordReset(userEmail)

    cy
      .request({
        method: 'POST',
        url: 'https://mailosaur.com/api/messages/await?server=abcdefg', // abcdefg is server name
        headers: {
        authorization: Cypress.env('mailosaurAuth')
      },
        body: {
          'sentTo': userEmail,
          'subject': 'Password reset'
        }
    }).then( response => {
      
      // continue with test, open link
      cy
        .visit(response.body.text.links[1])

      // fill in and confirm new password
      cy
        .get('#password')
        .type(newPassword);    
    
      cy
        .get('#passwordConfirm')
        .type(newPassword);
    
      cy
        .get('#reset-change-password-btn')
        .should('be.visible')
        .should('be.enabled')
        .click();

      // land on desired page after confirming password reset
      cy
        .location('href')
        .should('contains', '/login');

      // login with my new password
      // ...

    })

  });

});