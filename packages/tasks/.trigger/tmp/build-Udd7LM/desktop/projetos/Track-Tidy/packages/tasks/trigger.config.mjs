import {
  defineConfig
} from "../../../../../chunk-PEGTRPBK.mjs";
import {
  init_esm
} from "../../../../../chunk-5YFNUNE7.mjs";

// trigger.config.ts
init_esm();
var trigger_config_default = defineConfig({
  project: "proj_lgnoqylseptvaqsujvvk",
  enableConsoleLogging: true,
  retries: {
    enabledInDev: true
  },
  runtime: "node",
  logLevel: "log",
  maxDuration: 3600,
  // 1 hour
  build: {},
  dirs: ["./src/trigger"]
});
var resolveEnvVars = void 0;
export {
  trigger_config_default as default,
  resolveEnvVars
};
//# sourceMappingURL=trigger.config.mjs.map
