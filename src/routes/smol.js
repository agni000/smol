import { Router } from 'express'
import { helloSmol, postUrlHandler, readUrlHandler } from '../controllers/smol.js'

export const smolRouter = Router()

smolRouter.get('/', helloSmol)

smolRouter.get('/:smol', readUrlHandler)

smolRouter.post('/', postUrlHandler)

