import _ from 'lodash';

export const getIntoData = ({
  fields = [],
  object = {},
}: {
  fields: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: Record<string, any>;
}) => {
  return _.pick(object, fields);
};
