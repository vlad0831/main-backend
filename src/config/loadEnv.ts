export const loadEnvByKey =
  (...keys: string[]) =>
  () => {
    const keysToIterate = keys.length ? keys : Object.keys(process.env);
    return keysToIterate.reduce<Record<string, string>>(
      (env, key) => ({
        ...env,
        [key]: process.env[key],
      }),
      {}
    );
  };

const loadEnv = loadEnvByKey();

export default loadEnv;
