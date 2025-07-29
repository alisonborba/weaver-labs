export function Header({
  title,
  rightContent,
}: {
  title: string;
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0a1728]">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">{rightContent}</div>
        </div>
      </div>
    </div>
  );
}
