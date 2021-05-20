rm -r dist
mkdir dist
mkdir tmp
npx tsc src/VelocitousServer.ts --declaration --emitDeclarationOnly --esModuleInterop --outDir tmp --target ES6
npx dts-bundle --name velocitous --main tmp/VelocitousServer.d.ts --out ../dist/velocitous.d.ts > /dev/null
npx tsc-bundle tsconfig.json
npx minify tmp/bundle.js > dist/velocitous.min.js
rm -r tmp