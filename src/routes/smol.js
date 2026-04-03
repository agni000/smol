import { Router } from 'express'
import { helloSmol, postHandler } from '../controllers/smol.js'

export const smolRouter = Router()

smolRouter.get('/', helloSmol)

smolRouter.post('/', postHandler)

