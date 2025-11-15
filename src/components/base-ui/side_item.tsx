// ----------------------------
// Sidebar Item
// ----------------------------
export function SideItem({
  icon: Icon,
  label,
  active,
}: {
  icon: any
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm transition hover:bg-muted ${
        active ? 'bg-muted font-medium' : 'text-muted-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}
