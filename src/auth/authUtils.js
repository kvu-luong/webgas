import jwt from 'jsonwebtoken';
import configs from '@typeConfig/index';

export const createTokenPair = async (payload) => {
  const { access_secret, access_expiration, refresh_secret, refresh_expiration } =
    configs.commomConfig.jwt;
  try {
    const accessToken = await jwt.sign(payload, access_secret, {
      expiresIn: access_expiration,
    });

    const refreshToken = await jwt.sign(payload, refresh_secret, {
      expiresIn: refresh_expiration,
    });

    jwt.verify(accessToken, access_secret, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};
