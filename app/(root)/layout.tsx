export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3 pb-20 sm:pb-0">
        <div className="flex flex-col mt-8 md:pb-14">{children}</div>
      </main>
    </div>
  );
}
