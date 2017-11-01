const assert = require('assert');
const googledrive = require('../src/Google/quickstart.js')
const mocha = require('mocha');

describe('Google Drive Create Folder', () => {
	//createFolder
  it('Should return the file object of the folder created with a parent of Simplif.ai', () => {
    var token = {
        "access_token": "ya29.Glv2BO2UNAy6RRpo3elM7r-n5W5LBHsY91Gi-GPTjSqcwXtDThBmHFNElMmblT4knZzRXmNAjmu4gllRAvQWPgMr-9JoYl4kt1dLhOniWBUjPTSzKXuA_WpUhxsC",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ1U3dYdEdWN0NKbzFfYXFpUklXSGdRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTU3MTI3NywiZXhwIjoxNTA5NTc0ODc3fQ.vBirPVoonr-78ym1SqkGYStabXevxgtFMe8JoPtyE_tsf4YzQ8PNUJrLbTQLv5KT2FmaMpxBRDFXYp4mLP0zozOfFLE7fe3K77GZKdWdDmYHCjdAXTsuO9PAVYgZKSBZgGPKVw-8mH4ItrH-tOXlVCBPZVAyv9IeB2dZkCBooRPKDMN3mAwZPTHg7dIAZ7y0YP3cd0LclAI3nY21qDZSi1rvM68TRpk4XK_n8fhppsWbBRXNqNcZh2lhjl9bxIQbp3-p2pu95oQYoUGgpSDYj1QaMlH1GFsw38ai775aTi_P3JUHdY76HTuzvfrY48Vq7k24ltDA7L1Wgeyshxv73w",
        "token_type": "Bearer",
        "expiry_date": 1509574871937
    }
    googledrive.createFolder("Hello", token, function(err, file) {
    	assert.equal('Simplif.ai', file.parents[0]);
    });
  });


  it('Should error when a token is invalid and return null for file', (done) => {
    var token = {
        "access_token": "ThBmllRAvQWPgMr-9JoYl4kt1dLhOniWBUjPTSzKXuA_WpUhxsC",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ1U3dYdEdWN0NKbzFfYXFpUklXSGdRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTU3MTI3NywiZXhwIjoxNTA5NTc0ODc3fQ.vBirPVoonr-78ym1SqkGYStabXevxgtFMe8JoPtyE_tsf4YzQ8PNUJrLbTQLv5KT2FmaMpxBRDFXYp4mLP0zozOfFLE7fe3K77GZKdWdDmYHCjdAXTsuO9PAVYgZKSBZgGPKVw-8mH4ItrH-tOXlVCBPZVAyv9IeB2dZkCBooRPKDMN3mAwZPTHg7dIAZ7y0YP3cd0LclAI3nY21qDZSi1rvM68TRpk4XK_n8fhppsWbBRXNqNcZh2lhjl9bxIQbp3-p2pu95oQYoUGgpSDYj1QaMlH1GFsw38ai775aTi_P3JUHdY76HTuzvfrY48Vq7k24ltDA7L1Wgeyshxv73w",
        "token_type": "Bearer",
        "expiry_date": 1509574871937
    }

    googledrive.createFolder("TestFolder", token, function(err, file) {
      done(assert.notEqual(err, null) && assert.equal(file, null));
    });
  });
});


describe('Google Drive Add Collaborator', () => {
  it('Should not error out with valid email, token, and fileID', () => {
    var token = {
        "access_token": "ya29.Glv2BO2UNAy6RRpo3elM7r-n5W5LBHsY91Gi-GPTjSqcwXtDThBmHFNElMmblT4knZzRXmNAjmu4gllRAvQWPgMr-9JoYl4kt1dLhOniWBUjPTSzKXuA_WpUhxsC",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ1U3dYdEdWN0NKbzFfYXFpUklXSGdRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTU3MTI3NywiZXhwIjoxNTA5NTc0ODc3fQ.vBirPVoonr-78ym1SqkGYStabXevxgtFMe8JoPtyE_tsf4YzQ8PNUJrLbTQLv5KT2FmaMpxBRDFXYp4mLP0zozOfFLE7fe3K77GZKdWdDmYHCjdAXTsuO9PAVYgZKSBZgGPKVw-8mH4ItrH-tOXlVCBPZVAyv9IeB2dZkCBooRPKDMN3mAwZPTHg7dIAZ7y0YP3cd0LclAI3nY21qDZSi1rvM68TRpk4XK_n8fhppsWbBRXNqNcZh2lhjl9bxIQbp3-p2pu95oQYoUGgpSDYj1QaMlH1GFsw38ai775aTi_P3JUHdY76HTuzvfrY48Vq7k24ltDA7L1Wgeyshxv73w",
        "token_type": "Bearer",
        "expiry_date": 1509574871937
    }

    var fileID = '0B_cn468Fw_6GSXJ0czBOcmM3VlE';
    var collaborator = 'sdblatz@gmail.com';

    googledrive.addCollaborator(token, fileID, collaborator, function(err) {
      done(assert.equals(err, null));
    });

  });

  it('Should error out with invalid token', () => {
    var token = {
        "access_token": "ywXtDThBmHFNElMmblT4knZzRXmNAjmu4gllRAvQWPgMr-9JoYl4kt1dLhOniWBUjPTSzKXuA_WpUhxsC",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ1U3dYdEdWN0NKbzFfYXFpUklXSGdRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTU3MTI3NywiZXhwIjoxNTA5NTc0ODc3fQ.vBirPVoonr-78ym1SqkGYStabXevxgtFMe8JoPtyE_tsf4YzQ8PNUJrLbTQLv5KT2FmaMpxBRDFXYp4mLP0zozOfFLE7fe3K77GZKdWdDmYHCjdAXTsuO9PAVYgZKSBZgGPKVw-8mH4ItrH-tOXlVCBPZVAyv9IeB2dZkCBooRPKDMN3mAwZPTHg7dIAZ7y0YP3cd0LclAI3nY21qDZSi1rvM68TRpk4XK_n8fhppsWbBRXNqNcZh2lhjl9bxIQbp3-p2pu95oQYoUGgpSDYj1QaMlH1GFsw38ai775aTi_P3JUHdY76HTuzvfrY48Vq7k24ltDA7L1Wgeyshxv73w",
        "token_type": "Bearer",
        "expiry_date": 1509574871937
    }

    var fileID = '0B_cn468Fw_6GSXJ0czBOcmM3VlE';
    var collaborator = 'sdblatz@gmail.com';

    googledrive.addCollaborator(token, fileID, collaborator, function(err) {
      done(assert.notequal(err, null));
    });

  });

    it('Should error out with invalid fileID', () => {
    var token = {
        "access_token": "ywXtDThBmHFNElMmblT4knZzRXmNAjmu4gllRAvQWPgMr-9JoYl4kt1dLhOniWBUjPTSzKXuA_WpUhxsC",
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5NTA3ODMzMzY2MDctYTBhb2I4amkybzNra2x2NDFqOGZoOHE4ZWQwdGVnczguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMTE0NTcyNjY0MzQ5MjQ4MzkiLCJlbWFpbCI6InNkYmxhdHpAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ1U3dYdEdWN0NKbzFfYXFpUklXSGdRIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTU3MTI3NywiZXhwIjoxNTA5NTc0ODc3fQ.vBirPVoonr-78ym1SqkGYStabXevxgtFMe8JoPtyE_tsf4YzQ8PNUJrLbTQLv5KT2FmaMpxBRDFXYp4mLP0zozOfFLE7fe3K77GZKdWdDmYHCjdAXTsuO9PAVYgZKSBZgGPKVw-8mH4ItrH-tOXlVCBPZVAyv9IeB2dZkCBooRPKDMN3mAwZPTHg7dIAZ7y0YP3cd0LclAI3nY21qDZSi1rvM68TRpk4XK_n8fhppsWbBRXNqNcZh2lhjl9bxIQbp3-p2pu95oQYoUGgpSDYj1QaMlH1GFsw38ai775aTi_P3JUHdY76HTuzvfrY48Vq7k24ltDA7L1Wgeyshxv73w",
        "token_type": "Bearer",
        "expiry_date": 1509574871937
    }

    var fileID = '02340czBOcmM3VlE';
    var collaborator = 'sdblatz@gmail.com';

    googledrive.addCollaborator(token, fileID, collaborator, function(err) {
      done(assert.notequal(err, null));
    });
  });
});


describe('Google Drive Authenticate User', () => {
  it('Should error and return authentication url without googleToken', () => {

  googledrive.authenticateUser('', function(success, authorizeURL, googleToken) {
      done(assert.notEqual(authorizeURL, null));
    });
  });
});
