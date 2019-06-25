# 前端工程化之 Git Commit Message 规范校验及版本自动发布

commit message 是开发的日常工作，写好日志不仅有助于他人 review，还可以有效的输出 CHANGELOG，对项目的管理实际至关重要，但是在实际工作中却常常被大家忽略。

本文通过介绍一系列的集成脚本配置，实现 git commit message 的可视化输入、规范校验、版本管理及输出 CHANGLOG

## commit message 规范

目前规范用的比较多的是[Angular 团队规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)，继而衍生了[Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)。很多工具的默认配置也是基于此规范，格式如下：

```shell
<type>(<scope>?): <subject>
<BLANK LINE>
<body?>
<BLANK LINE>
<footer?>
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
| revert | 回滚某个更早之前的提交 |
| chore | 不属于以上类型的其他类型 |

## git commit 模板

如果你只是个人的项目，或者想尝试一下这样的规范格式，那么你可以为 git 设置 commit template，每次 git commit 的时候在 vim 中带出，时刻提醒自己：

修改 ~/.gitconfig，添加：

```shell
[commit]
template = ~/.gitmessage
```

新建 ~/.gitmessage 内容可以如下：

```shell
# head: <type>(<scope>): <subject>
# - type: feat, fix, docs, style, refactor, test, chore
# - scope: can be empty (eg. if the change is a global or difficult to assign to a single component)
# - subject: start with verb (such as 'change'), 50-character line
#
# body: 72-character wrapped. This should answer:
# * Why was this change necessary?
# * How does it address the problem?
# * Are there any side effects?
#
# footer:
# - Include a link to the ticket, if any.
# - BREAKING CHANGE
#
```

## husky: git hooks 识别并执行自定义脚本

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

## commitlint: git commit message 规范校验

[commitlint](https://github.com/conventional-changelog/commitlint)用来检查 git message 是否符合规定的的提交格式，一般和 husky 一起使用，你可以自定义你的提交信息规范，当不符合规定格式时将会抛出错误

- **安装 commitlint**

```shell
yarn add @commitlint/cli @commitlint/config-angular --dev
```

这里安装了两个包，`@commitlint/cli`是核心的功能包， `@commitlint/config-angular`是来自 Angular 团队的规范

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

- **添加 commitlint 规范自定义配置文件**

在项目根目录下新建 `commitlint.config.js` 文件，并对 commitlint 进行简单配置

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

## commitizen: 规范可视化

以上我们通过 commitlint 对 git message 进行校验，配置了一些简单的命令和脚本，执行过程中需要我们手动的输入一系列指令并且牢记规范的各个 type 类型是用来做什么的

为了提供更加便捷的方式，我们引入[commitizen](https://github.com/commitizen/cz-cli)，commitizen 在我们提交代码时提供交互界面，帮助我们按照顺序去填写信息，然后合成信息并发起 commit

- **全局安装 commitizen**

```shell
yarn add -g commitizen
```

全局安装完 commitizen 之后，可以在项目中直接执行 git cz

- **项目安装 commitizen**

```shell
yarn add commitizen --dev
```

同时在 `package.json` 中配置：

```json
"script": {
  "commit: "git-cz"
}
```

若只在项目级安装，则只能执行 `npm run commit`。如果全局安装过，则 `git cz` 和 `npm run commit` 都可以执行

- **挑选 Adapter**

commitizen 有很多 Adapter 可以选择，他们提供了各种各样的提交规范模板，比如[cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)（一个符合 Angular 团队规范的 preset），使用它可以帮助我们按照指定的规范生成 commit message

另外一款[cz-customizable](https://github.com/leonardoanalista/cz-customizable)可以让你指定一套属于自己团队的规范

全局或者项目级安装：

```shell
yarn add cz-customizable -g
or
yarn add cz-customizable --dev
```

修改 `package.json` 中的 config：

```json
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

同时在项目根目录下新建 `.cz-config.js` 文件，维护你想要的规范格式。

## standard-version: 自动生成 release 并生成 CHANGELOG

通过以上工具的帮助，我们已经能够得到比较规范的 commit message，规范 commit message 之后，我们可以使用[standard-version](https://link.zhihu.com/?target=https%3A//github.com/conventional-changelog/standard-version)自动生成 CHANGELOG，并更新项目的版本信息并添加 tag，CHANGELOG 将收录所有 type 为 `feat`和 `fix`的 commit message

- **安装 standard-version**

```shell
yarn add standard-version --dev
```

- **配置脚本命令**

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

- **版本发布流程**

```shell
# 切换至mater分支
git checkout master
# 拉取远程分支
git pull origin master
# 拉取远程信息
git fetch origin --prune
# 自动生成CHANGELOG并更新版本为1.0.0
npm run release -- --release-as 1.0.0
# 更新本地tag到远程分支
git push --follow-tags origin master
```

## 最后

以上工具帮助大家形成从 commit message 规范到校验到发布的整个流程，除了以上提到的功能，大家还可以去其 github 首页查阅其更多功能。最后我们可以通过一些指令管理工具让上面这些脚本命令形成一键式提交和发布
