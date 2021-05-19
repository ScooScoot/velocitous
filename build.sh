npx tsc-bundle tsconfig.json
npx tsc src/index.ts --declaration --emitDeclarationOnly
npx minify dist/bundle.js > dist/bundle.min.js
rm dist/bundle.js
sed -i 's/declare module "index"/declare module "velocitous"/g' dist/types.d.ts