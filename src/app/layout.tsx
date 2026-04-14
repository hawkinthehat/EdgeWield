export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#050608', color: 'white', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}