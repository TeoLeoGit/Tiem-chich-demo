//Google APIs
require('dotenv').config()
const fs = require('fs')
const { google } = require('googleapis');


module.exports = {
    async uploadFile(filePath, originalName) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        )
        oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        })
        try {
            const res = await drive.files.create({
              requestBody: {
                name: originalName,
                parents: ['1KnrUUaNCRgXQElCI5_3NoMabwqyJMvte'],
                mimeType: 'image/jpg'
              },
              media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
              }
            })

            return await this.generatePublicUrl(drive, res.data.id)
          } catch (error) {
            console.log("1: ")
            console.log(error)
          }
    },

    async generatePublicUrl(drive, fileId) {
      try {
        const id = fileId;
        await drive.permissions.create({
          fileId: id,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        })

        const result = await drive.files.get({
          fileId: id,
          fields: 'webViewLink, webContentLink' 
        })
        
        return Object.values(result.data)[0]
      } catch(error) {
        console.log("2: ")
        console.log(error.message)
      }

    },

    async uploadAdminImage(filePath, originalName) {
      const oauth2Client = new google.auth.OAuth2(
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          process.env.REDIRECT_URI
      )
      oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
      const drive = google.drive({
          version: 'v3',
          auth: oauth2Client
      })
      try {
          const res = await drive.files.create({
            requestBody: {
              name: originalName,
              parents: ['1hcEFAn0G935wQnAdS9Mo91vGnjkXTrEc'],
              mimeType: 'image/jpg'
            },
            media: {
              mimeType: 'image/jpg',
              body: fs.createReadStream(filePath)
            }
          })

          return await this.generatePublicUrl(drive, res.data.id)
        } catch (error) {
          console.log("1: ")
          console.log(error)
        }
  },

  async generatePublicUrl(drive, fileId) {
    try {
      const id = fileId;
      await drive.permissions.create({
        fileId: id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })

      const result = await drive.files.get({
        fileId: id,
        fields: 'webViewLink, webContentLink' 
      })
      
      return Object.values(result.data)[0]
    } catch(error) {
      console.log("2: ")
      console.log(error.message)
    }

  }
}