export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  CALLBACK_URL: process.env.CALLBACK_URL,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});
