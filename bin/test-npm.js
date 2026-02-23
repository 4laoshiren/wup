import { npm_pkg_check_outdated, npm_pkg_update } from "../src/managers/-npm.js";

const outdated_pkgs = await npm_pkg_check_outdated();
console.log(outdated_pkgs);

const update_result = await npm_pkg_update("supabase");
console.log(update_result);