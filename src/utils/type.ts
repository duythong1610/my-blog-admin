export const interfaceToEnum = <T>() => {
  return new Proxy(
    {},
    {
      get: function (target, prop, receiver) {
        return prop;
      },
    }
  ) as {
    [P in keyof T]-?: P;
  };
};

export type NullishType<T> = { [key in keyof T]?: T[key] };
