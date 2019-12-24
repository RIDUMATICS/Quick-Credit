import generateToken from './generateToken';

const setCookie = (res, input) => {
  const token = generateToken(input.user || input.admin);
  res.cookie('jwt_token', token, {
    httpOnly: true,
  });
};

export default setCookie;
