import { scoop_pkg_check_outdated, scoop_pkg_update } from "../src/managers/-scoop.js";

const outdated_pkgs = await scoop_pkg_check_outdated();
console.log(outdated_pkgs);

const update_result = await scoop_pkg_update("supabase");
console.log(update_result);
