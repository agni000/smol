import express from 'express'
import { smolRouter } from './routes/smol.js'

export const app = express()

app.use(express.static('./src/public'))

app.use('/api/smol', smolRouter)


