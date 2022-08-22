import { LinkProof } from './util';
import { AccountID } from 'caip';
export interface AuthProvider {
    readonly isAuthProvider: true;
    authenticate(message: string): Promise<string>;
    createLink(did: string): Promise<LinkProof>;
    accountId(): Promise<AccountID>;
    withAddress(address: string): AuthProvider;
}
//# sourceMappingURL=auth-provider.d.ts.map