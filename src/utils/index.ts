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

export const removeUndefinedObject = <T>(obj: T & Record<string, any>) => {
  if (typeof obj !== 'object') return {};
  Object.keys(obj).forEach((k: string) => {
    if (_.isNil(obj[k])) {
      // remove when input is null or undefined
      delete obj[k];
    }
  });

  return obj;
};

export const updateNestedObjectParser = <T>(obj: T & Record<string, any>) => {
  const final: Record<string, any> = {};
  Object.keys(obj).forEach((k: string) => {
    console.log(obj[k], 'bug');
    // 1 loop
    if (!_.isNil(obj[k]) && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);

      Object.keys(response).forEach((a: string) => {
        if (!_.isNil(response[a])) {
          console.log(response[a], 'response[a]');
          final[`${k}.${a}`] = response[a];
        } else {
          console.log(response[a], 'deeteresponse[a]');
          delete obj[k][a];
        }
      });
    } else {
      if (!_.isNil(obj[k])) {
        console.log(obj[k], 'else[k]');
        final[k] = obj[k];
      } else {
        console.log(obj[k], 'delete else[k]');
        delete obj[k];
      }
    }
  });

  return final;
};
