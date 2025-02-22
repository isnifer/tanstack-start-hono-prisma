module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: "avoid",
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "react-native-reanimated",
    "./sideeffects",
    "index.css$",
    "^dayjs/locale",
    "^(fs|fs/promises|path|crypto)$",
    "^react",
    "^@(?!server|shared)[a-z-_]+",
    "^[a-z]+",
    "^@shared(.*)$",
    "^@server(.*)$",
    "^@/typings(.*)$",
    "^@/dbSchemas(.*)$",
    "^@/lib(.*)$",
    "^@/store(.*)$",
    "^@/router(.*)$",
    "^@/constants(.*)$",
    "^./constants$",
    "^@/jobs(.*)$",
    "^@/utils(.*)$",
    "^./utils(.*)$",
    "^@/emails(.*)$",
    "^@/hooks(.*)$",
    "^./plugins(.*)$",
    "^@/screens(.*)$",
    "^./domain(.*)$",
    "^./routes(.*)$",
    "^@/components(.*)$",
    "^@/icons(.*)$",
    "^@/assets(.*)$",
    "^[./](?!.*(.module.css)).*$",
    ".module.css$",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
