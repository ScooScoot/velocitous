rm -r dist
mkdir dist
mkdir temp
npx tsc src/VelocitousServer.ts --declaration --emitDeclarationOnly --esModuleInterop --outDir temp
npx dts-bundle --name velocitous --main temp/VelocitousServer.d.ts --out ../dist/velocitous.d.ts > /dev/null
npx tsc-bundle tsconfig.json
npx minify temp/bundle.js > dist/velocitous.min.js
rm -r temp