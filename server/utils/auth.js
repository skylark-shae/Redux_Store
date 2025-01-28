import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import 'dotenv/config';

const secret = process.env.JWT_SECRET || '';
const expiration = '2h';

// Custom error for authentication
export const AuthenticationError = new GraphQLError('Could not authenticate, user error.', {
  extensions: {
    code: 'UNAUTHENTICATED',
  },
});

export const authMiddleware = function ({ req }) {
  // Allow multi-source token
  let token = req.body.token || req.query.token || req.headers.authorization;
  // Split token from 'Bearer' string
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }
  // If no token, return request
  if (!token) {
    return req;
  }

  try {
    // Verify token
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) { // If token is invalid
    console.log('Invalid token:', error.message);
    throw new AuthenticationError('Invalid token!');
  }

  return req;
};

// Function to sign token
export const signToken = function ({ firstName, email, _id }) {
  const payload = { firstName, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};