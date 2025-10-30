import User from "../models/User.js"
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" })
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" })
    }

    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const existingUsername = await User.findOne({ username })

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" })
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

    const user = new User({
      email,
      username,
      password,
      profileImage
    })

    await user.save()

    const token = generateToken(user._id)

    return res.status(201).json({
        token,
        user: {
           _id: user._id,
           email: user.email,
           username: user.username,
           profileImage: user.profileImage 
        }
    })

  } catch (error) {
    console.log('Error is register route ',error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        // check if user exists
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" })
        // check if password is correct
        const isMatch = await user.comparePassword(password)
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" })
        const token = generateToken(user._id)
        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log("Error is register route ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export { register, login };