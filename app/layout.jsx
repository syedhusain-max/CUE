import './globals.css';
import './pseudo.css';
import CueShell from '../components/cue/CueShell';

export const metadata = {
  title: 'Cue. Animated websites, written as one prompt',
  description: 'Animated hero templates, each with the prompt that builds it.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Cue', statusBarStyle: 'black-translucent' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

const swScript = "if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Wordmark and type-voice fonts, referenced by name in the ported styles. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@700&family=Unbounded:wght@700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body>
        <CueShell />
        {children}
      </body>
    </html>
  );
}
