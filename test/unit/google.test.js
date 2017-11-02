const assert = require('assert');
const googledrive = require('../src/Google/quickstart.js')
const mocha = require('mocha');

describe('quickstart.js', () => {
	//createFolder
	//function createFolder(name, token, callback) {

  it('Should return the file object of the folder created with a parent of Simplifia', () => {
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
