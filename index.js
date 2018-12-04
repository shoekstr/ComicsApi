const https = require('https')
const url = require('url')
const fs = require('fs')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')

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

  const urlPath = parsedUrl.pathname
  // const trimmedPath = urlPath.replace(/^\/+|\/+$/g, '')
  //
  // const queryStringObject = parsedUrl.query
  //
  // const method = req.method.toLowerCase()
  //
  // const headers = req.headers
  //
  // let binary = []

  // req.on('data', (data) => {
  //   binary.push(data)
  // })
  //
  // req.on('end', () => {
  //   const data = Buffer.concat(binary)
  //   console.log(data.indexOf('\n\n'))
  //   console.log(data.toString().substring(0, data.indexOf('\n\n')))
  //   fs.writeFile(path.join(__dirname, 'uploads', 'binary2.txt'), data, (err) => {
  //     if (err) err(err)
  //
  //     console.log('File Written')
  //   })
  // })
  //
  // const data = {
  //   trimmedPath: trimmedPath,
  //   queryStringObject: queryStringObject,
  //   method: method,
  //   headers: headers,
  //   data: binary
  // }

  upload.single('f')(req,res, (err) => {
    if(err) {
      return res.end('Error uploading file.')
    }

    fs.rename(
      path.join(__dirname, req.file.path),
      path.join(__dirname, 'uploads', req.file.originalname),
      (err) => {
        if(err) err(err)

        res.end('File is uploaded')
      }
    )
  })
}
