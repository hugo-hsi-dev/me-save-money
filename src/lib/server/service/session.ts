import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

export class SessionService {
	generateNewExpiration() {
		return new Date(Date.now() + 60 * 60 * 24 * 30);
	}

	generateNewToken(): string {
		const tokenBytes = new Uint8Array(20);
		crypto.getRandomValues(tokenBytes);
		const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
		return token;
	}

	getIdFromToken(token: string) {
		return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	}

	validateExpiration({ expiresAt }: { expiresAt: Date }) {
		return Date.now() >= expiresAt.getTime();
	}
}
