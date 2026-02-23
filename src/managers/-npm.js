import { execa } from "execa";

async function npm_pkg_check_outdated() {
    const npm_outdated = await execa`ncu -g`;
    return npm_outdated.stdout;
}

async function npm_pkg_update(package_name) {
    const pkg_update_result = await execa`npm update -g ${package_name}`;
    return pkg_update_result.stdout;
}

export { npm_pkg_check_outdated, npm_pkg_update };