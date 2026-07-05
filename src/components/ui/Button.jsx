export function Button({
  children,
  variant = 'primary',
  size,
  block,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
