import axios from 'axios';
import semver from 'semver';

const request = axios.create({
  timeout: 3000,
});

export interface PkgInfo {
  _id: string;
  _rev: string;
  name: string;
  description?: string;
  'dist-tags': Record<string, string>;
  versions: Record<string, Record<string, any>>;
  readme: string;
  maintainers: { name: string; email: string; }[];
  time: {
    modified: string;
    created: string;
    [key: string]: string;
  };
  author?: {
    name: string;
    [key: string]: any;
  };
  repository?: {
    type?: string;
    url?: string;
    [key: string]: any;
  };
  homepage?: string;
  keywords?: string[];
  bugs?: {
    url?: string;
    [key: string]: any;
  };
  license?: string;
  readmeFilename: string;
  users?: {
    [key: string]: boolean;
  };
};

export const getPkgInfo = async (
  pkgName: string,
  registryUrl = 'https://registry.npmjs.org/',
  opts?: {
    timeout?: number;
  },
): Promise<PkgInfo> => {
  if (!registryUrl.endsWith('/')) registryUrl += '/';

  const { data, status } = await request.get(registryUrl + pkgName, { timeout: opts?.timeout ?? 3000 });
  if (status !== 200) {
    throw new Error(`找不到npm包[${pkgName}]`);
  }
  if (data?.error) {
    throw new Error(data?.error);
  }

  return data;
};

export const getLatestVersion = async (pkgName: string, opts?: {
  registryUrl?: string,
  npmTag?: string,
  timeout?: number,
}) => {
  const { registryUrl, npmTag } = Object.assign({
    npmTag: 'latest',
    registryUrl: 'https://registry.npmjs.org/',
  }, opts ?? {});

  const pkgInfo = await getPkgInfo(pkgName, registryUrl, { timeout: opts?.timeout });

  const latestVersion= pkgInfo?.['dist-tags']?.[npmTag] ?? null;
  return latestVersion;
};

export const getVersions = async (pkgName: string, registryUrl?: string, opts?: { timeout?: number; }) => {
  const pkgInfo = await getPkgInfo(pkgName, registryUrl, { timeout: opts?.timeout });

  const versions = Object.keys(pkgInfo?.versions ?? []);
  return versions;
};

export const validatePkg = async (pkgName: string, { version, registryUrl, timeout }: { version?: string, registryUrl?: string, timeout?: number }) => {
  try {
    if (typeof version !== 'string') {
      await getPkgInfo(pkgName);
      return true;
    } else {
      const versions = await getVersions(pkgName, registryUrl, { timeout });
      return versions.some(v => semver.satisfies(version, v));
    }
  } catch {
    return false;
  }
};
