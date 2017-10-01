# Backend

## How to use summarizer Api
To send text to the summarizer Api to summarize(using the middleware endpoint):
1. Make a post http-request on the endpoint path 'http://localhost:8000/sumarizertext'. 
2. Add the text to be sent in a json object as below:
```javascipt
var mock = "Hi this is Lena's mock text";
var json = {
    'text': mock
}
```
3. The body received from the request of the middleware endpoint is in a stringified JSON object 
4. Handle that summarized data recieved as needed
5. The data that will sent back to your api that called the middleware should be parsed to a JSON object
#Example
An example of a get request of making an api that does a post request to send the text to the middleware endpoint, receives the strignifies JSON object of the summarized data from the middleware endpoint, then makes a callback to send that data back to the api that called the middleware. This example doesn't handle or make any changes to the summarized data, but it could be added. 
```javascript
app.get('/mocktext', function(req, res) {
    var mock = "Hi this is Lena's mock text";
    var json = {
        'text': mock
    }
    console.log("json of text: " + json)
        var options = {
        url: 'http://localhost:8000/sumarizertext',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json) 
    }
    request.post(options, function(error, response, body){
        res.send(JSON.parse(body));
    })
})
```