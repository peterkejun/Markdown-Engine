const enum ElementType {
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
}

exports.getDelimiter = (type: ElementType): string => {
    switch (type) {
        case ElementType.CODE: return '```';
        default: return '\n';
    }
}

exports.incrementHeadingType = (type: ElementType): ElementType => {
    switch (type) {
        case ElementType.H1: return ElementType.H2;
        case ElementType.H2: return ElementType.H3;
        case ElementType.H3: return ElementType.H4;
        case ElementType.H4: return ElementType.H5;
        case ElementType.H5: return ElementType.H6;
        default: return ElementType.H6;
    }
};

exports.isHeading = (type: ElementType): Boolean => {
    return type === ElementType.H1 ||
        type === ElementType.H2 ||
        type === ElementType.H3 ||
        type === ElementType.H4 ||
        type === ElementType.H5 ||
        type === ElementType.H6;
}

