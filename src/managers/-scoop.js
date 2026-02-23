import { execa } from "execa";

async function scoop_pkg_check_outdated() {
    const outdated_pkgs = await execa`scoop status`;
    return outdated_pkgs.stdout;
}

async function scoop_pkg_update(package_name) {
    const pkg_update_result = await execa`scoop update ${package_name}`;
    return pkg_update_result.stdout;
}

export { scoop_pkg_check_outdated, scoop_pkg_update };
