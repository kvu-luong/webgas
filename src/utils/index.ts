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

// ['a', 'b'] => {a: 1, b:1 }
export const getSelectData = (select: string[] = []): Record<string, number> => {
  return Object.fromEntries(select.map((el: string) => [el, 1]));
};

export const unSelectData = (unSelectData: string[] = []): Record<string, number> => {
  return Object.fromEntries(unSelectData.map((el) => [el, 0]));
};
