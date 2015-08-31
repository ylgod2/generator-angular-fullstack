'use strict';

var config = browser.params;<% if (filters.mongooseModels) { %>
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');<% } %><% if (filters.sequelizeModels) { %>
var UserModel = require(config.serverConfig.root + '/server/sqldb').User;<% } %>

describe('Logout View', function() {
  var login = function(user) {
    browser.get(config.baseUrl + '/login');
    require('../login/login.po').login(user);
  };

  var testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test'
  };

  beforeEach(function() {
    return UserModel
      <% if (filters.mongooseModels) { %>.removeAsync()<% }
         if (filters.sequelizeModels) { %>.destroy({ where: {} })<% } %>
      .then(function() {
        <% if (filters.mongooseModels) { %>return UserModel.createAsync(testUser);<% }
           if (filters.sequelizeModels) { %>return UserModel.create(testUser);<% } %>
      })
      .then(function() {
        return login(testUser);
      });
  });

  after(function() {
    <% if (filters.mongooseModels) { %>return UserModel.removeAsync();<% }
       if (filters.sequelizeModels) { %>return UserModel.destroy({ where: {} });<% } %>
  })

  describe('with local auth', function() {

    it('should logout a user and redirecting to "/"', function() {
      var navbar = require('../../components/navbar/navbar.po');

      <%= expect() %>browser.getCurrentUrl()<%= to() %>.eventually.equal(config.baseUrl + '/');
      <%= expect() %>navbar.navbarAccountGreeting.getText()<%= to() %>.eventually.equal('Hello ' + testUser.name);

      browser.get(config.baseUrl + '/logout');

      navbar = require('../../components/navbar/navbar.po');

      <%= expect() %>browser.getCurrentUrl()<%= to() %>.eventually.equal(config.baseUrl + '/');
      <%= expect() %>navbar.navbarAccountGreeting.isDisplayed()<%= to() %>.eventually.equal(false);
    });

  });
});
