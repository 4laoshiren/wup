import { execa } from "execa";

const npm_pkg_check_outdated = async () => {
    const npm_outdated = await execa`ncu -g`;
    return npm_outdated.stdout;
};

const npm_pkg_update = async (package_name) => {
    const pkg_update_result = await execa`npm update -g ${package_name}`;
    return pkg_update_result.stdout;
};

export { npm_pkg_check_outdated, npm_pkg_update };
