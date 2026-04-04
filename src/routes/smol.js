import { Router } from 'express'
import { postUrlHandler, readUrlHandler } from '../controllers/smol.js'

export const smolRouter = Router()

smolRouter.get('/:smol', readUrlHandler)

smolRouter.post('/', postUrlHandler)

