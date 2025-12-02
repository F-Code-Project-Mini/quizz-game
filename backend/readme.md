# Express TypeScript Project Setup Guide

This guide walks you through setting up a basic Express.js project with TypeScript.

## 1. Install Node.js and npm

Ensure Node.js and npm (Node Package Manager) are installed. Verify by running the following commands in your terminal:

```bash
node -v
npm -v
```

If not installed, download Node.js from [Node.js Official Website](https://nodejs.org).

## 2. Create a New Project

Create a project directory and navigate into it:

```bash
mkdir express-ts-project
cd express-ts-project
```

## 3. Initialize package.json

Generate a `package.json` file:

```bash
npm init -y
```

## 4. Install Required Packages

Install Express, TypeScript, and necessary TypeScript type definitions:

```bash
npm install express
npm install typescript @types/node @types/express --save-dev
```

-   `express`: The Express framework.
-   `typescript`: TypeScript compiler.
-   `@types/node` and `@types/express`: TypeScript type definitions for Node.js and Express.

## 5. Configure TypeScript

Create a TypeScript configuration file (`tsconfig.json`) in the project root:

```bash
npx tsc --init
```

Edit `tsconfig.json` with the following settings:

```json
{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist"
    },
    "include": ["src/**/*.ts"]
}
```

## 6. Set Up Source Directory and Files

Create a `src` directory for TypeScript source files:

```bash
mkdir src
```

Create `src/index.ts` as the application's entry point:

```typescript
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World from Express with TypeScript!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```

## 7. Add Build and Run Scripts

Update the `scripts` section in `package.json`:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsc && node dist/index.js"
}
```

## 8. Compile and Run the Application

Compile TypeScript code:

```bash
npm run build
```

Run the application:

```bash
npm run start
```

The application will be accessible at `http://localhost:3000`.

## 9. Optional: Set Up TypeScript Watcher

For automatic recompilation on code changes, install `ts-node` and `nodemon`:

```bash
npm install ts-node nodemon --save-dev
```

Add a `dev` script to `package.json`:

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/index.ts"
}
```

Run the application in development mode:

```bash
npm run dev
```

The application will automatically recompile and reload on code changes.
