import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": ["error"],
            "@typescript-eslint/no-require-imports": "off",
            "react-hooks/exhaustive-deps": "off",
            "import/order": [
                "error",
                {
                    groups: [
                        ["builtin", "external"],
                        ["internal"],
                        ["parent", "sibling", "index"],
                    ],
                    pathGroups: [
                        { pattern: "next/**", group: "builtin", position: "before" },
                        { pattern: "react", group: "external", position: "before" },
                        { pattern: "@/app/api/**", group: "internal", position: "before" },
                        { pattern: "@/libs/**", group: "internal", position: "before" },
                        { pattern: "@/utils/**", group: "internal", position: "before" },
                        { pattern: "@/actions/**", group: "internal", position: "before" },
                        { pattern: "@/hooks/**", group: "internal", position: "before" },
                        { pattern: "@/interfaces/**", group: "internal", position: "after" },
                        { pattern: "@/types/**", group: "internal", position: "after" },
                        { pattern: "@/layouts/**", group: "internal", position: "after" },
                        { pattern: "@/components/**", group: "internal", position: "after" },
                        { pattern: "@/assets/**", group: "internal", position: "after" },
                        { pattern: "@/styles/**", group: "internal", position: "after" },
                        { pattern: "@/**", group: "internal", position: "after" },
                    ],
                    pathGroupsExcludedImportTypes: ["react"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                    "newlines-between": "never",
                },
            ],
        },
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "src/components/ui/*",
        ],
    },
];

export default eslintConfig;