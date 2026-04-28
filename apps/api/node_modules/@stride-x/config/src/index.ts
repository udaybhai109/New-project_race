export function loadEnv(env: NodeJS.ProcessEnv) {
  return {
    GRAPHQL_PLAYGROUND: env.GRAPHQL_PLAYGROUND !== "false"
  };
}
