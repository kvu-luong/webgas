import ApiKeyModel from '@models/apiKey.model';

export const findApiKeyById = async (key: string) => {
  // await ApiKeyModel.create({
  //   key: '5second',
  //   permissions: ['normal'],
  // });
  const objKey = await ApiKeyModel.findOne({
    key,
    status: true,
  });
  return objKey;
};
