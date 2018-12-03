const https = require('https')
const url = require('url')
const fs = require('fs')
const StringDecoder = require('string_decoder').StringDecoder

const config = require('./config')

const httpServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpServerOptions, (req, res) => {
  unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, () => {
  console.log('The HTTPS server is running on port ' + config.httpsPort)
})

const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true)

  const path = parsedUrl.pathName
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  const queryStringObject = parsedUrl.query

  const method = req.method.toLowerCase()

  const headers = req.headers

  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()
  })

  const data = {
    trimmedPath: trimmedPath,
    queryStringObject: queryStringObject,
    method: method,
    headers: headers,
    payload: buffer
  }

  console.log(data)

  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
}
