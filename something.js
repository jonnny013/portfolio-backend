Warning The following packages contained npm lifecycle scripts (preinstall/install/postinstall) that were not executed:
┠─ npm:bcrypt@5.1.1
┃
┠─ This may cause the packages to not work correctly.
┠─ Lifecycle scripts are only supported when using a `node_modules` directory.
┠─ Enable it in your deno config file:
┖─ "nodeModulesDir": "auto"
error: Uncaught (in promise) Error: Cannot find module '/deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/lib/binding/napi-v3/bcrypt_lib.node'
Require stack:
- /deno-dir/npm/registry.npmjs.org/bcrypt/5.1.1/bcrypt.js