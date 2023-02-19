const pipe = (...args) =>
  args.reduce((acc, el) => {
    if (Array.isArray(el)) {
      const [func, ...params] = el;

      return func(acc, ...params);
    }

    return el(acc);
  });

export default pipe;
