var Promise = require('bluebird');
var cheerio = require('cheerio');
var glob = require('glob');

var request = Promise.promisify(require('request'), {multiArgs: true});

function login(username, password) {
  return Promise.coroutine(function *() {
    var jar = request.jar();
    var result = yield request({
      uri: 'http://redmine.nane.cn/redmine/login',
      jar: jar
    });
    var html = result[1];

    var $ = cheerio.load(html);
    var token = $('input[name=authenticity_token]').attr('value');

    var result = yield request({
      uri: 'http://redmine.nane.cn/redmine/login',
      method: 'POST',
      jar: jar,
      form: {
        authenticity_token: token,
        username: username,
        password: password
      }
    });

    if (result[0].statusCode != 302) {
      throw new Error('cant login');
    }

    return jar;
  })();
}

function getAuthenticityToken(jar, project) {
  return Promise.coroutine(function *() {
    var baseUri = 'http://redmine.nane.cn/redmine';
    var result = yield request({
      uri: `${baseUri}/projects/${project}/issues/new`,
      jar: jar
    });
    var html = result[1];
    var $ = cheerio.load(html);
    var token = $('input[name=authenticity_token]').attr('value');
    return token;
  })();
}

function createIssue(auth, subject, description) {
  return Promise.coroutine(function *() {

    var baseUri = 'http://redmine.nane.cn/redmine';

    var formData = {
      authenticity_token: auth.token,
      'issue[subject]': subject,
      'issue[description]': description,
      'issue[tracker_id]': 2, // for task
      'issue[status_id]': 1,
      'issue[priority_id]': 2
    };

    var result = yield request({
      uri: `${baseUri}/projects/${auth.project}/issues`,
      method: 'POST',
      formData: formData,
      jar: auth.jar
    });

    return result[0];

  })();
}

function authenticate(username, password, project) {
  return Promise.coroutine(function *() {
    var jar = yield login(username, password);
    var token = yield getAuthenticityToken(jar, project);
    return {jar, token, project};
  })();
}

function getTranslateSubject(filename) {
  return `[TRANSLATE] ${filename}`;
}

function getReviewSubject(filename) {
  return `[REVIEW] ${filename}`;
}

function getReviewDescription(filename) {
  return [
    `source: https://github.com/allseenalliance/extras-webdocs/blob/master/${filename}`,
    `translated: https://github.com/smart-conn/alljoyn-zh/blob/master/${filename}`
  ].join('\n');
}

function getTranslateDescription(filename) {
  return `Please see: https://github.com/smart-conn/alljoyn-zh/blob/master/${filename}`;
}

Promise.coroutine(function *() {

  // please use your own username and password
  var auth = yield authenticate('xxx', 'xxx', 'allseenchinesetranslation');
  console.log('auth complete');

  var count = 0;

  glob('docs/**/*.md', function(err, files) {
    Promise.all(files.map(function(filename) {
      return Promise.all([
        createIssue(auth, getTranslateSubject(filename), getTranslateDescription(filename)),
        createIssue(auth, getReviewSubject(filename), getReviewDescription(filename))
      ]).then(function() {
        console.log(`${filename} complete`);
      });
    })).then(function() {
      console.log('done');
    });
  });

})().catch(console.log.bind(console));
