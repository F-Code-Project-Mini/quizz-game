import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_", // param bắt đầu bằng _ sẽ không báo unused
                    varsIgnorePattern: "^_", // biến thường bắt đầu bằng _ cũng bỏ qua
                    caughtErrorsIgnorePattern: "^_", // error trong catch (err) nếu đặt _err thì cũng bỏ qua
                },
            ],
        },
    },
]);
