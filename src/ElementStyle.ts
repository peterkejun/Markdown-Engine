export const enum ElementStyle {
    NONE = 'none',
    BOLD = 'bold',
    ITALIC = 'italic',
    STRIKETHROUGH = 'strikethrough',
}

// This function returns the closing style corresponding to an opening style
export const getStyleDelimiter = (style: ElementStyle): ElementStyle => {
    return style;
}