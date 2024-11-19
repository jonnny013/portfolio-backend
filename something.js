Warning The following packages contained npm lifecycle scripts (preinstall/install/postinstall) that were not executed:
─ npm:bcrypt@5.1.1

─ This may cause the packages to not work correctly.
─ Lifecycle scripts are only supported when using a `node_modules` directory.
─ Enable it in your deno config file:
┖─ "nodeModulesDir": "auto"
error: Uncaught (in promise) Error: Cannot find module '/deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/lib/binding/napi-v3/bcrypt_lib.node'
Require stack:
- /deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/bcrypt.js
- /deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/bcrypt.js
    at Function.Module._resolveFilename (node:module:619:15)
    at Function.Module._load (node:module:497:27)
    at Module.require (node:module:681:19)
    at require (node:module:818:16)
    at Object.<anonymous> (file:///deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/bcrypt.js:6:16)
    at Object.<anonymous> (file:///deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/bcrypt.js:238:4)
    at Module._compile (node:module:745:34)
    at Object.Module._extensions..js (node:module:762:10)
    at Module.load (node:module:662:32)
    at Function.Module._load (node:module:534:12)
    info: Trying to execute an npm package using Node-API addons,
          these packages require local `node_modules` directory to be present.
    hint: Add `"nodeModulesDir": "auto" option to `deno.json`, and then run
          `deno install --allow-scripts=npm:<package> --entrypoint <script>` to setup `node_modules` directory.