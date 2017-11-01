const assert = require('assert');
const googledrive = require('../src/Google/quickstart.js')
const mocha = require('mocha');

describe('Google Drive Integration', () => {
	//createFolder
	//function createFolder(name, token, callback) {

  it('Should return the file object of the folder created with a parent of Simplif.ai', () => {
    var token = {
        "access_token": "ya29.Glv2BDNV2NL4lrnGjbEidWX5qcxpkLpm28aGNvlAM4kzjnKy8YItI7f1B77yjgghzvoeLK09H-IPPm_sgsJhCUrIYtdCcW_KscMr5yJdyNdQmQt9ZMxbBfFi110T",
        "token_type": "Bearer",
        "expiry_date": 1509570903126
    }
    googledrive.createFolder("TestFolder", token, function(err, file) {
    	assert.equal('Simplif.ai', file.parents[0]);
    });
    //assert.equal('Hello, world!', hello());
  });


  it('Should return the file object of the folder created with a parent of Simplif.ai', () => {
    var token = {
        "access_token": "ya29.Glv2BDNV2NL4lrnGjbEidWX5qcxpkLpm28aGNvlAM4kzjnKy8YItI7f1B77yjgghzvoeLK09H-IPPm_sgsJhCUrIYtdCcW_KscMr5yJdyNdQmQt9ZMxbBfFi110T",
        "token_type": "Bearer",
        "expiry_date": 1509570903126
    }
    googledrive.createFolder("TestFolder", token, function(err, file) {
      assert.equal('Simplif.ai', file.parents[0]);
    });
    //assert.equal('Hello, world!', hello());
  });


/*
  it('it should pass the name when it is passed', () => {
    assert.equal('Hello, username!', hello('username'));
  });
  */
});
