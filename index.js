var http = require('http')

var server = http.createServer(function(req, res) {
    if(req.url === '/favicon.ico') return res.statusCode = 404, res.end()
    console.log(req.method + ' ' + req.url)
    var data = ''
    req.on('data', function(chunk) {
        data += chunk
    })
    req.on('end', function() {
        console.log(data)
    })
    res.end('done')
})

server.listen(3000, function() {
    console.log('listening on 3000')
})
