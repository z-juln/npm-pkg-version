import axios from 'axios';

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
): Promise<PkgInfo> => {
  if (!registryUrl.endsWith('/')) registryUrl += '/';

  const { data, status } = await axios.get(registryUrl + pkgName);
  if (status !== 200) {
    throw new Error(`找不到npm包[${pkgName}]`);
  }
  if (data?.error) {
    throw new Error(data?.error);
  }

  return data;
};

export const getLatestVersion = async (pkgName: string, opts: {
  registryUrl?: string,
  npmTag?: string,
}) => {
  const { registryUrl, npmTag } = Object.assign(opts, {
    npmTag: 'latest',
  });

  const pkgInfo = await getPkgInfo(pkgName, registryUrl);

  const latestVersion= pkgInfo?.['dist-tags']?.[npmTag] ?? null;
  return latestVersion;
};

export const getVersions = async (pkgName: string, registryUrl?: string) => {
  const pkgInfo = await getPkgInfo(pkgName, registryUrl);

  const versions = Object.keys(pkgInfo?.versions ?? []);
  return versions;
};
