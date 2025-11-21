import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Using system fonts for reliability during build
// Google Fonts can be added later via CDN if needed

export const metadata: Metadata = {
  title: 'DRLTAS - Digital Readiness & Legacy-Transfer Audit System',
  description: 'Comprehensive assessment platform for evaluating business digital maturity and succession readiness',
  keywords: ['digital transformation', 'business audit', 'exit readiness', 'legacy transfer'],
  authors: [{ name: 'ExitReady' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
