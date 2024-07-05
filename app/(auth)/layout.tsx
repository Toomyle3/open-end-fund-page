import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full">
      <div className="flex justify-center">
        <Image
          src="/images/background.jpg"
          alt="background"
          fill
          className="size-full"
        />
      </div>
      {children}
    </main>
  );
}
