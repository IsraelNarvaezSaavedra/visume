export { default as ModernTemplate } from './ModernTemplate';
export { default as CreativeTemplate } from './CreativeTemplate';
export { default as ElegantTemplate } from './ElegantTemplate';
export { default as BoldTemplate } from './BoldTemplate';

export const getTemplate = (template: string) => {
  switch (template) {
    case 'creative': return 'CreativeTemplate';
    case 'elegant': return 'ElegantTemplate';
    case 'bold':    return 'BoldTemplate';
    default:        return 'ModernTemplate';
  }
};