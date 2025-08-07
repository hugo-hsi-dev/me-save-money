import { getPresets } from '$lib/remote/preset.remote';

import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		presets: await getPresets()
	};
};
