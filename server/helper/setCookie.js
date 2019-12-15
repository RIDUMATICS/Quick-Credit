import generateToken from './generateToken';

const setCookie = (res, { user }) => {
  const token = generateToken(user);
  res.cookie('jwt_token', token, {
    httpOnly: true,
  });
};

export default setCookie;
