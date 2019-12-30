import generateToken from './generateToken';

const setCookie = (res, input) => {
  const token = generateToken(input.user || input.admin);
  res.cookie('jwt_token', token, {
    httpOnly: true,
    maxAge: 86400000, // 86400000 milliseconds = 1 day
  });
};

export default setCookie;
