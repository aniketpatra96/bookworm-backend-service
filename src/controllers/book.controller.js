import Book from '../models/Book.js'
import cloudinary from '../lib/cloudinary.js'

const createBook = async (req,res) => {
    try {
        const { title, caption, rating, image } = req.body
        if(!title || !caption || !rating || !image) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageURl = uploadResponse.secure_url
        // save to the database
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageURl,
            user: req.user._id
        })
        await newBook.save()
        return res.status(201).json(newBook)
    } catch (error) {
        console.log('Error Creating Book ',error)
        return res.status(500).json({ message: error.message })
    }
}

// pagination => infinite loading
const getBooks = async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit
        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'username profileImage')
        const totalBooks = await Book.countDocuments()
        return res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })
    } catch (error) {
        console.log('Error Getting Books ', error)
        return res.status(500).json({ message: error.message })
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findById(id)
        if(!book) {
            return res.status(404).json({ message: 'Book not found' })
        }
        // check if the user is the owner of the book
        if(book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        // delete the image from cloudinary
        if(book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (deleteError) {
                console.error("Error deleting image from cloudinary ", deleteError)
            }
        }
        await book.deleteOne()
        return res.status(200).json({ message: 'Book deleted successfully' })
    } catch (error) {
        console.log('Error Deleting Book ', error)
        return res.status(500).json({ message: error.message })
    }
}

// get recommended books by the logged in user
const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json(books)
    } catch (error) {
        console.log('Error Getting Recommended Books ', error)
        return res.status(500).json({ message: error.message })
    }
}

export { createBook, getBooks, deleteBook, getRecommendedBooks }