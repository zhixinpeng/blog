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
