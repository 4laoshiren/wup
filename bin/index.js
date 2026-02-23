#!/usr/bin/env node
//指定终端输入wup时用node执行而不是打开文件

import { npm_pkg_check_outdated, npm_pkg_update } from "../src/managers/-npm.js";
import { scoop_pkg_check_outdated, scoop_pkg_update } from "../src/managers/-scoop.js";
import { select, isCancel, spinner } from "@clack/prompts";
import pc from "picocolors"

// 获取用户输入，如果输入一个词，进入交互模式，如果两个词，非交互模式更新
const package_name = process.argv[2];
// 定义一个spinner，spinner定义复制自：https://bomb.sh/docs/clack/packages/prompts/#spinner
// 用picocolors改动了cancel和errorMessage的颜色为红色
const spin = spinner({
    indicator: 'timer',
    cancelMessage: pc.red("Process cancelled"),
    errorMessage: pc.red("Process failed"),
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    delay: 80,
    styleFrame: (frame) => pc.magenta(frame),
    });

// 工具函数：打印分组标题
function print_header(name) {
    console.log(`\n  ${pc.cyan(pc.bold(`── ${name} ──`))}`);
}

if (package_name) {
    // 非交互模式
    // 使用bold凸显被更新的包名
    spin.start(`Trying Updating ${pc.bold(package_name)} across ${pc.cyan('npm')} and ${pc.cyan('scoop')}...`);
    const [npm_result, scoop_result] = await Promise.allSettled([npm_pkg_update(package_name), scoop_pkg_update(package_name)])
    spin.stop(pc.green('Done'));
    print_header('scoop');
    console.log(`'scoop update ${package_name}' output:\n ${scoop_result.value}`);
    print_header('npm');
    console.log(`'npm update -g ${package_name}' output: ${npm_result.value}`);
}
 else {
    // 交互模式
    // 定义一个response
    const response = await select({
        message: 'Which package manager to check?',
        options: [
            { label: 'all', value: 'all' },
            { label: 'scoop', value: 'scoop' },
            { label: 'npm', value: 'npm' }
        ]
    });
    // 如果用户没有选择，退出
    if (isCancel(response)) process.exit(0);
    // 如果用户选择all，并行执行scoop和npm的检查更新
    if (response === 'all') {
        spin.start('Checking all package managers...');
        const [scoop_result, npm_result] = await Promise.allSettled([scoop_pkg_check_outdated(), npm_pkg_check_outdated()]);
        spin.stop(pc.green('Done'));

        print_header('scoop');
        console.log(scoop_result.status === 'fulfilled' ? scoop_result.value : pc.yellow('  ✖ scoop is not available'));

        print_header('npm');
        console.log(npm_result.status === 'fulfilled' ? npm_result.value : pc.yellow('  ✖ npm/ncu is not available'));
    }
    // 如果用户选择scoop，执行scoop的检查更新
    if (response === 'scoop') {
        spin.start('Checking scoop...');
        try {
            const scoop_output = await scoop_pkg_check_outdated();
            spin.stop(pc.green('Done'));
            print_header('scoop');
            console.log(scoop_output || pc.green('  ✔ all packages are up to date'));
        } catch {
            spin.stop(pc.yellow('Done'));
            print_header('scoop');
            console.log(pc.yellow('  ✖ scoop is not available'));
        }
    }
    // 如果用户选择npm，执行npm的检查更新
    if (response === 'npm') {
        spin.start('Checking npm...');
        try {
            const npm_output = await npm_pkg_check_outdated();
            spin.stop(pc.green('Done'));
            print_header('npm');
            console.log(npm_output || pc.green('  ✔ all packages are up to date'));
        } catch {
            spin.stop(pc.yellow('Done'));
            print_header('npm');
            console.log(pc.yellow('  ✖ npm/ncu is not available'));
        }
    }
}