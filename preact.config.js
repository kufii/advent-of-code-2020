export default (config, env) => {
  config.resolve.modules.push(env.src + '/app')
}
