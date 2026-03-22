import { Router } from 'express'
import { helloSmol } from '../controllers/smol.js'

export const smolRouter = Router()

smolRouter.get('/', helloSmol)



