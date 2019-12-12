import jwt from 'jsonwebtoken';

const generateToken = ({
  id, firstName, lastName, email, address, status, isAdmin,
}) => {
  const token = jwt.sign(
    {
      id, firstName, lastName, email, address, status, isAdmin,
    }, process.env.secretOrPrivateKey, { expiresIn: 3600 },
  );
  return token;
};

export default generateToken;
