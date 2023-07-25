import configs from '@typeConfig/index';
import { argon2i } from 'argon2-ffi';
import crypto from 'crypto';
import util from 'util';

export const generateHashPassword = async (password: string): Promise<string> => {
  const getRandomBytes = util.promisify(crypto.randomBytes);
  const salt = await getRandomBytes(32);
  const hashedPassword = await argon2i.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (
  hashPassword: string,
  password: string
): Promise<boolean> => {
  return await argon2i.verify(hashPassword, password);
};
