import type { HtmlTagDescriptor, Plugin } from 'vite';

const bootstrap = (measurementId: string): string => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');
`;

export const googleAnalytics = (measurementId: string): Plugin => ({
  name: 'demo-analytics',

  transformIndexHtml: (): HtmlTagDescriptor[] => [
    {
      tag: 'script',
      attrs: {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      },
      injectTo: 'head',
    },
    {
      tag: 'script',
      children: bootstrap(measurementId),
      injectTo: 'head',
    },
  ],
});
