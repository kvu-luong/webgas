import KeyStoreModel from '@models/keyStore.model';
import { Types } from 'mongoose';

export class KeyStoreService {
  static saveRefreshToken = async ({
    userId,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
  }): Promise<string | null | unknown> => {
    try {
      const filter = { user: userId },
        update = {
          refreshToken,
          refreshTokenUsed: [],
        },
        options = {
          upsert: true,
          new: true,
        };

      const keyStore = await KeyStoreModel.findOneAndUpdate(filter, update, options);
      return keyStore ? keyStore.refreshToken : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId: string) => {
    return await KeyStoreModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeById = async (id: string) => {
    return await KeyStoreModel.deleteOne({ _id: id });
  };

  static removeByUserId = async (userId: string) => {
    return await KeyStoreModel.deleteOne({ user: userId });
  };

  static updateToken = async ({
    keyStoreId,
    newRefreshToken,
    refreshTokenUsed,
  }: {
    keyStoreId: string;
    newRefreshToken: string;
    refreshTokenUsed: string;
  }) => {
    return await KeyStoreModel.updateOne(
      {
        _id: new Types.ObjectId(keyStoreId),
      },
      {
        $set: {
          refreshToken: newRefreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshTokenUsed,
        },
      }
    );
  };
}
