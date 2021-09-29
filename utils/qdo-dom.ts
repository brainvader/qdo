export function getTags(metaData: HTMLCollectionOf<HTMLMetaElement>): string[] {
    const tags = metaData.namedItem('keywords')!
    // TODO: create and return brand-new meta element
    // if (tags === null) {}
    return tags.content.split(",")
}
