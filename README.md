# @juln/npm-pkg-version

## install

`npm i @juln/npm-pkg-version -S`

## use

```typescript
import { getPkgInfo, getLatestVersion, getVersions } from '@juln/npm-pkg-version';
import type { PkgInfo } from '@juln/npm-pkg-version';

(async () => {
  console.log({
    // 第二个参数默认为'https://registry.npmjs.org/'
    pkgInfo: await getPkgInfo('pkgName', 'https://registry.npmjs.org/'),
    latestVersion: await getLatestVersion('pkgName', {
      npmTag: 'latest', // 默认为'latest'
      registryUrl: 'https://registry.npmjs.org/', // 默认为'https://registry.npmjs.org/'
    }),
    // 第二个参数默认为'https://registry.npmjs.org/'
    versions: await getVersions('pkgName', 'https://registry.npmjs.org/'),
  });
})();
```