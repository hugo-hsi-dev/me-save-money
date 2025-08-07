export const USER_CONFIG = ['Hugo', 'Cassie'] as const;
export type User = (typeof USER_CONFIG)[number];
