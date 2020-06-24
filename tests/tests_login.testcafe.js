import { Selector } from 'testcafe';

fixture `Tests Login`
    .page `http://dev-intranet-frontend.origin-enquetes-technico-legales-inc.globetechnologie.net/`;

test('Bad password', async t => {
    await t
        .typeText(Selector('#login-email'), 'mathieul@globetechnologie.com')
        .typeText(Selector('#login-password'), '1111')
        .click(Selector('span').withText('Login'))
        .expect(Selector('#login-password-helper-text').textContent).eql("Mot de passe erroné");
});

test('Valid username after login', async t => {
    await t
        .typeText(Selector('#login-email'), 'mathieul@globetechnologie.com')
        .typeText(Selector('#login-password'), 'test1234')
        .click(Selector('span').withText('Login'))
        .expect(Selector('p').withText('Mathieu Leclerc').textContent).eql("Mathieu Leclerc")
        .expect(Selector('p').withText('mathieul@globetechnologie.com').textContent).eql("mathieul@globetechnologie.com")
        .expect(Selector('[class^="MuiTypography-root-539 normal-case font-600 flex M"]').textContent).eql("Mathieu Leclerc");
});

test('Valid email address at login', async t => {
    await t
        .typeText(Selector('#login-email'), 'math')
        .typeText(Selector('#login-email'), 'ieulglobetechnologie')
        .typeText(Selector('#login-password'), 'test1234')
        .click(Selector('.flex.flex-col.justify-center.w-full'))
        .expect(Selector('#login-email-helper-text').textContent).eql("Doit etre une adresse email valide");
});

test('Mot de passe oublié', async t => {
    await t
        .click(Selector('#forgot-password-link'))
        .expect(Selector('h6').withText('MOT DE PASSE OUBLIÉ ?').textContent).eql("MOT DE PASSE OUBLIÉ ?")
        .typeText(Selector('#forgot-password-email'), 'mathieu')
        .click(Selector('[class^="MuiCardContent-root flex flex-col items-center jus"]').find('.flex.flex-col.justify-center.w-full'))
        .expect(Selector('#forgot-password-email-helper-text').textContent).eql("Doit etre une adresse email valide");
});