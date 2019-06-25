# git message 规范校验和版本发布管理

利用 node 脚本实现 git message 的可视化输入并进行规范配置管理，实现版本发布命名并生成更新日志

## git message 规范校验

### 识别 git message 钩子执行自定义脚本

[husky](https://github.com/typicode/husky)的主要功能是识别 git [hooks](https://git-scm.com/docs/githooks)，它允许在我们执行一些 git 命令时触发自定义脚本。

- **安装 husky**

```shell
yarn add husky --dev
```

- **修改 package.json**

主要添加以下代码段：

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "echo $HUSKY_GIT_PARAMS"
    }
  }
}
```

这段代码的功能是添加识别 `commit-msg` 钩子之后，需要执行的脚本命名：在 git commit 执行之前会在终端输出 git 的所有参数

### 执行 git message 规范校验

[commitlint](https://github.com/conventional-changelog/commitlint)用来检查 git message 是否符合规定的的提交格式，一般和 husky 一起使用，你可以自定义你的提交信息规范，当不符合规定格式时将会抛出错误

- **安装 commitlint**

```shell
yarn add @commitlint/cli @commitlint/config-angular --dev
```

这里安装了两个包，`@commitlint/cli`是核心的功能包， `@commitlint/config-angular`是一份用来继承然后进行自定义修改的 git message 规范包

- **修改 package.json**

修改 husky 配置的 `commit-msg` 钩子要执行的脚本命令

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

主要这里的环境变量参数写法是 `HUSKY_GIT_PARAMS`，没有 `$`

- **添加 commitlint 规范配置文件**

在项目根目录下新建 commitlint.config.js 文件，并对 commitlint 进行简单配置

```javascript
module.exports = {
  // 继承默认配置
  extends: ["@commitlint/config-angular"],
  // 自定义规则
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "chore", "style"]
    ],
    "header-max-length": [0, "always", 72]
  }
};
```

配置说明：规则由键值和配置数组组成，键值在我们继承的默认配置[config-angular](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular)文档里可以找到，配置数组的第一位表示等级，可选 0（禁用），1（警告），2（错误），第二位表示规则是否应该使用，可选 always | never，第三位为该规则的允许值。

- **commlint 默认规范格式**

```shell
type(scope?): subject
body?
footer?
```

- scope 表示 commit 影响的范围（哪些模块进行了修改）
- subject 表示 commit 的简短描述
- body 表示 commit 的长描述
- footer 表示 commit 尾部信息
- type 表示 commit 的类型，一般有下面几种

| 类型 | 描述 |
| --- | --- |
| build | 修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交 |
| ci | 修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交 |
| docs | 文档更新 |
| feat | 新增功能 |
| fix | bug 修复 |
| perf | 性能优化 |
| refactor | 重构代码(既没有新增功能，也没有修复 bug) |
| style | 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑) |
| test | 新增测试用例或是更新现有测试 |
| revert | 不属于以上类型的其他类型 |

在了解规范之后，执行 git commit 试着提交一下 message。

### 新增可交互界面

以上我们通过 commitlint 对 git message 进行校验，配置了一些简单的命令和脚本，执行过程中需要我们手动的输入一系列指令并且牢记规范的各个 type 类型是用来做什么的

为了提供更加便捷的方式，我们引入[commitizen](https://github.com/commitizen/cz-cli)，commitizen 在我们提交代码时提供交互界面，帮助我们按照顺序去填写信息，然后合成信息并发起 commit
