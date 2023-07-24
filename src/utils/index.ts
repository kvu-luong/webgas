import _ from 'lodash';

export const getIntoData = ({ fields = [], object = {} }: { fields: string[]; object: {} }) => {
  return _.pick(object, fields);
};
