"use strict";

module.exports = {
  types: [
    {
      value: "feat",
      name: "✨  feat: 新增功能"
    },
    {
      value: "fix",
      name: "🐞  fix: BUG修复"
    },
    {
      value: "refactor",
      name: "🛠  refactor: 重构代码，既没有新增功能，也没有修复 bug "
    },
    {
      value: "docs",
      name: "📚  docs: 文档更新"
    },
    {
      value: "test",
      name: "🏁  test: 新增测试用例或是更新现有测试"
    },
    {
      value: "chore",
      name:
        "🗯  chore: 不属于以上类型的其他类型"
    },
    {
      value: "style",
      name:
        "💅  style: 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)"
    },
    {
      value: "revert",
      name: "⏪  revert: 回滚某个更早之前的提交"
    }
  ],

  scopes: [],

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"]
};
