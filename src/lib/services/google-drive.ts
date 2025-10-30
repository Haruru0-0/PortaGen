/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { google } from 'googleapis'
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

// Encrypt token before storing in DB
export function encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

// Decrypt token when retrieving from DB
export function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

// Create OAuth2 client
export function getOAuth2Client() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.GOOGLE_REDIRECT_URI}`
    )
}

// Get authenticated Drive client for user
export function getDriveClient(accessToken: string, refreshToken: string) {
    const oauth2Client = getOAuth2Client()

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    })

    return google.drive({ version: 'v3', auth: oauth2Client })
}

export async function uploadToUserDrive(
    accessToken: string,
    refreshToken: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
) {
    try {
        const drive = getDriveClient(accessToken, refreshToken)

        // Create "Portfolio Assets" folder if it doesn't exist
        const folderId = await getOrCreatePortfolioFolder(drive)

        // Create readable stream from buffer
        const { Readable } = require('stream')
        const bufferStream = new Readable()
        bufferStream.push(fileBuffer)
        bufferStream.push(null)

        // Upload file
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType,
                body: bufferStream,
            },
            fields: 'id, name, webViewLink, webContentLink, mimeType, size',
        })

        // Make file publicly accessible
        await drive.permissions.create({
            fileId: response.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        })

        const fileId = response.data.id!
        const isImage = mimeType.startsWith('image/')
        const isAudio = mimeType.startsWith('audio/')

        // Generate proper URLs
        let displayUrl = ''
        let thumbnailUrl = ''
        let downloadUrl = ''

        if (isImage) {
            // For images: use the thumbnail for display, direct link for download
            displayUrl = `https://drive.google.com/uc?id=${fileId}`
            thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w300-h300` // Fixed size thumbnail
            downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        } else if (isAudio) {
            // For audio: use direct link for playback and download
            displayUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
            downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        } else {
            // For other files
            displayUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
            downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        }

        return {
            fileId,
            fileName: response.data.name!,
            displayUrl,
            thumbnailUrl,
            downloadUrl,
            fileSize: response.data.size ? parseInt(response.data.size) : 0,
        }
    } catch (error: any) {
        console.error('Google Drive upload error:', error)

        // Handle token refresh if needed
        if (error.code === 401) {
            throw new Error('REFRESH_TOKEN_NEEDED')
        }

        throw new Error('Failed to upload to Google Drive')
    }
}

// Delete file from user's Google Drive
export async function deleteFromUserDrive(
    accessToken: string,
    refreshToken: string,
    fileId: string
) {
    try {
        const drive = getDriveClient(accessToken, refreshToken)

        await drive.files.delete({
            fileId,
        })

        return { success: true }
    } catch (error: any) {
        console.error('Google Drive delete error:', error)

        if (error.code === 401) {
            throw new Error('REFRESH_TOKEN_NEEDED')
        }

        throw new Error('Failed to delete from Google Drive')
    }
}

// Get or create "Portfolio Assets" folder in user's Drive
async function getOrCreatePortfolioFolder(drive: any): Promise<string> {
    try {
        // Search for existing folder
        const response = await drive.files.list({
            q: "name='Portfolio Assets' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'files(id, name)',
            spaces: 'drive',
        })

        if (response.data.files && response.data.files.length > 0) {
            return response.data.files[0].id
        }

        // Create folder if it doesn't exist
        const folderResponse = await drive.files.create({
            requestBody: {
                name: 'Portfolio Assets',
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id',
        })

        return folderResponse.data.id
    } catch (error) {
        console.error('Error creating folder:', error)
        throw error
    }
}

// List user's uploaded files
export async function listUserFiles(
    accessToken: string,
    refreshToken: string,
    folderId?: string
) {
    try {
        const drive = getDriveClient(accessToken, refreshToken)

        const folder = folderId || await getOrCreatePortfolioFolder(drive)

        const response = await drive.files.list({
            q: `'${folder}' in parents and trashed=false`,
            fields: 'files(id, name, webViewLink, webContentLink, mimeType, size, createdTime, thumbnailLink)',
            orderBy: 'createdTime desc',
            pageSize: 100,
        })

        return response.data.files || []
    } catch (error: any) {
        console.error('Google Drive list error:', error)

        if (error.code === 401) {
            throw new Error('REFRESH_TOKEN_NEEDED')
        }

        throw new Error('Failed to list files')
    }
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
    try {
        const oauth2Client = getOAuth2Client()
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        })

        const { credentials } = await oauth2Client.refreshAccessToken()

        return {
            accessToken: credentials.access_token!,
            expiryDate: credentials.expiry_date,
        }
    } catch (error) {
        console.error('Token refresh error:', error)
        throw new Error('Failed to refresh access token')
    }
}