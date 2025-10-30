import express from 'express'
import { createBook, getBooks, deleteBook, getRecommendedBooks } from '../controllers/book.controller.js'
import protectRoute from '../middleware/auth.middleware.js'

const bookRouter = express.Router()

bookRouter.post('/', protectRoute, createBook)
bookRouter.get('/', protectRoute, getBooks)
bookRouter.delete('/:id', protectRoute, deleteBook)
bookRouter.get('/user', protectRoute, getRecommendedBooks)

export default bookRouter