export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#245D30] min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
