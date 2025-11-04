import jwt from 'jsonwebtoken'

function generateToken(user) {
  return jwt.sign(
    {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
}

export default generateToken