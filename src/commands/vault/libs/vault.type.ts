export enum VaultMethod {
  token = 'token',
  userpass = 'userpass',
  ldap = 'ldap',
  oidc = 'oidc',
}

export enum VaultFormat {
  json = 'json',
  table = 'table',
  yaml = 'yaml',
}

export interface VaultLoginOptions {
  method: VaultMethod;
  address: string;
  format: VaultFormat;
}

export interface VaultLoginOutput {
  user_token: string;
  expire_time: string;
}

interface AuthResponse {
  client_token: string;
  accessor: string;
  policies: string[];
  token_policies: string[];
  identity_policies: string[];
  metadata: object;
  orphan: boolean;
  entity_id: string;
  lease_duration: number;
  renewable: boolean;
  mfa_requirement: object;
}

export interface VaultLoginResponse {
  request_id: string,
  lease_id: string,
  lease_duration: number,
  renewable: boolean,
  data: object,
  warnings: object,
  auth: AuthResponse,
}
