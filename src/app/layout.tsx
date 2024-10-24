import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body
                className={"antialiased bg-white text-black"}
            >
                {children}
            </body>
        </html>
    );
}
