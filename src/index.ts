const { incrementHeadingType, isHeading } = require('./ElementType');

interface MarkdownElement {
    type: ElementType,
    style: ElementStyle,
    content: string,
};
