context('Groups', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(()=> {
    cy.preserveCookies();
  });

  it('should create and edit a group', () => {

    cy.server();
    cy.route("POST", "**/api/v1/groups/group*").as("postGroup");

    cy.get('m-group--sidebar-markers li:first-child').contains('New group').click();

    cy.location('pathname').should('eq', '/groups/create');

    // add a banner
    cy.uploadFile('minds-banner #file', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');

    // add a name
    cy.get('.m-group-info-name > input').type('test');
    // add a description
    cy.get('.m-group-info-brief-description > textarea').type('This is a test');

    // click on hashtags dropdown
    cy.get('m-hashtags-selector .m-dropdown--label-container').click();
    // select #ART
    cy.get('m-hashtags-selector  m-dropdown m-form-tags-input > div > span').contains('art').click();
    // type in another hashtag manually
    cy.get('m-hashtags-selector m-form-tags-input input').type('hashtag{enter}').click();
    // click away
    cy.get('m-hashtags-selector .minds-bg-overlay').click();

    cy.get('.m-groups-save > button').contains('Create').click();
    cy.route("POST", "**/api/v1/groups/group/*/banner*").as("postBanner");

    cy.wait('@postGroup').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    }).wait('@postBanner').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    });

    cy.get('.m-groupInfo__name').contains('test');
    cy.get('.m-groupInfo__description').contains('This is a test');

    // open settings button
    cy.get('minds-groups-settings-button > button').click();

    cy.get('minds-groups-settings-button ul.minds-dropdown-menu li:first-child').contains('Edit').click();

    // edit name
    cy.get('.m-groupInfo__name input').type(' group');

    // edit description
    cy.get('.m-groupInfo__description textarea').type(' group');

    // open settings button
    cy.get('minds-groups-settings-button > button').click();

    cy.get('minds-groups-settings-button ul.minds-dropdown-menu li:first-child').contains('Save').click();

    cy.get('.m-groupInfo__name').contains('test group');
    cy.get('.m-groupInfo__description').contains('This is a test group');
  })

  it('should be able to toggle conversation and comment on it', () => {

    cy.get("m-group--sidebar-markers li:contains('test group')")
      .first()
      .click();


    // toggle the conversation
    cy.get('.m-groupGrid__right').should('be.visible');
    cy.get('.m-groupGrid__toggleBtn').click();
    cy.get('.m-groupGrid__right').should('not.be.visible');
    cy.get('.m-groupGrid__toggleBtn').click();

    // comment
    cy.get('minds-groups-profile-conversation m-comments__tree minds-textarea .m-editor').type('lvl 1 comment');
    cy.get('minds-groups-profile-conversation m-comments__tree a.m-post-button').click();

    // comment should appear on the list
    cy.get('minds-groups-profile-conversation m-comments__tree > m-comments__thread .m-commentBubble__message').contains('lvl 1 comment');

    cy.on('window:confirm', (str) => {
      return true;
    });
  })

  it('should post an activity inside the group and record the view when scrolling', () => {
    cy.get("m-group--sidebar-markers li:contains('test group')")
      .first()
      .click();

    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/activity/*").as("view");

    cy.get('minds-newsfeed-poster textarea').type('This is a post');

    cy.get('.m-posterActionBar__PostButton').click();

    // the activity should show that it was posted in this group
    cy.get('.minds-list minds-activity .body a:nth-child(2)').contains('(test group)');

    cy.get('.minds-list minds-activity .m-mature-message-content').contains('This is a post');

    // create the post
    cy.get('minds-newsfeed-poster textarea').type('This is a post that will record a view');

    cy.get('.m-posterActionBar__PostButton').click();

    cy.scrollTo(0, '20px');

    cy.wait('@view').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });
  });

  it('should delete a group', () => {
    cy.get('m-group--sidebar-markers li:nth-child(3)').contains('test group').click();

    // cleanup
    cy.get('minds-groups-settings-button > button').click();
    cy.get('minds-groups-settings-button ul.minds-dropdown-menu > li:nth-child(8)').contains('Delete Group').click();
    cy.get('minds-groups-settings-button m-modal .mdl-button--raised').contains('Confirm').click();

    cy.location('pathname').should('eq', '/groups/member');
  })

})
