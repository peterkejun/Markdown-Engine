export const enum ElementType {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    TEXT = 'text',
    BLOCKQUOTE = 'blockquote',
    ORDERED_LIST = 'ordered list',
    UNORDERED_LIST = 'unordered lsit',
    CODE = 'code',
    LINK = 'link',
    IMAGE = 'image',
    NEWLINE = 'new line',
}

// This function returns the closing type corresponding to an opening type.
export const getTypeDelimiter = (type: ElementType): ElementType => {
    // the closing type for headings is newline
    if (isHeading(type)) {
        return ElementType.NEWLINE;
    } else {
        return type;
    }
}

// This function returns the incremented heading for a given heading, i.e. H1 => H2, H4 => H5, H6 => H6.
export const incrementHeadingType = (type: ElementType): ElementType => {
    switch (type) {
        case ElementType.H1: return ElementType.H2;
        case ElementType.H2: return ElementType.H3;
        case ElementType.H3: return ElementType.H4;
        case ElementType.H4: return ElementType.H5;
        case ElementType.H5: return ElementType.H6;
        default: return ElementType.H6;
    }
};

// This function returns true if given type is a heading, and false otherwise.
export const isHeading = (type: ElementType): Boolean => {
    return type === ElementType.H1 ||
        type === ElementType.H2 ||
        type === ElementType.H3 ||
        type === ElementType.H4 ||
        type === ElementType.H5 ||
        type === ElementType.H6;
}

