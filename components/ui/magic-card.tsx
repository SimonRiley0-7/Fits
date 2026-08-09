export function MagicCard({ children, className }: { children: React.ReactNode, className?: string, gradientColor?: string }) {
  return <div className={className}>{children}</div>;
}
