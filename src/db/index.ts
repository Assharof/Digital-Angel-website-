type QueryResult = unknown[];

type Chain = {
  (...args: unknown[]): Chain;
  then: <TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>;
};

const createChain = (): Chain => {
  let proxy: Chain;
  const chain = (() => proxy) as Chain;
  proxy = new Proxy(chain, {
    get(target, property) {
      if (property === "then") {
        return (onfulfilled?: (value: QueryResult) => unknown) =>
          Promise.resolve([] as QueryResult).then(onfulfilled);
      }
      if (property === "catch") {
        return (onrejected?: (reason: unknown) => unknown) =>
          Promise.resolve([] as QueryResult).catch(onrejected);
      }
      if (property === "finally") {
        return (onfinally?: () => void) => Promise.resolve([] as QueryResult).finally(onfinally);
      }
      return proxy;
    },
    apply() {
      return proxy;
    },
  });

  return proxy;
};

/**
 * Database-free compatibility adapter.
 *
 * The public site is intentionally static, so database reads return empty
 * collections and mutations are harmless no-ops. Keeping this adapter means
 * legacy admin/API modules do not crash the preview while no database is
 * configured.
 */
export const db = new Proxy(
  {},
  {
    get() {
      return createChain();
    },
  },
) as any;

export const pool = null;
