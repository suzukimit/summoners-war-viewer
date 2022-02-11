export function entry(object: any): {key: string, value: any}[] {
    return Object.entries(object).map(([key, value]) => ({key, value}));
}

export function entryFromKey(object: any, key: string): {key: string, value: any} {
    return entry(object).find(e => e.key === key);
}
