type IconProps = {
  name: string // e.g. "success"
  alt?: string
  className?: string
}

export function Icon({ name, alt = name, className = 'w-6 h-6' }: IconProps) {
  const src = `/svg/${name}.svg`

  return <img src={src} alt={alt} className={className} />
}
