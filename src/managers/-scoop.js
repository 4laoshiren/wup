import { execa } from "execa";

const scoop_pkg_check_outdated = async () => {
    const outdated_pkgs = await execa`scoop status`;
    return outdated_pkgs.stdout;
};

const scoop_pkg_update = async (package_name) => {
    const pkg_update_result = await execa`scoop update ${package_name}`;
    return pkg_update_result.stdout;
};

export { scoop_pkg_check_outdated, scoop_pkg_update };
