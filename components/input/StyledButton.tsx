import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';

const BUTTON_CLASSES = 'p-2 border duration-150 rounded-lg focus:ring disabled:opacity-75 disabled:bg-gray-600 disabled:text-gray-200';

export function StyledButton({
  children,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames(
    BUTTON_CLASSES,
    buttonProps.className,
  );
  return (
    <button
      type="button"
      {...buttonProps}
      className={classes}
    >
      {children}
    </button>
  );
}

export function StyledLinkButton({
  children,
  disabled,
  ...buttonProps
}: LinkProps & { children?: ReactNode, className?: string, disabled?: boolean }) {
  const classes = classNames(
    BUTTON_CLASSES,
    'text-center black',
    buttonProps.className,
  );
  if (disabled) {
    return <StyledButton disabled className={buttonProps.className}>{children}</StyledButton>;
  }

  return (
    <Link
      {...buttonProps}
      className={classes}
    >
      {children}
    </Link>
  );
}

export function ResetButton({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <StyledButton
      onClick={onClick}
      className="relative top-7 right-9 m-0 h-8 rounded-full border-0 bg-gray-300 py-1 px-2.5 opacity-30 hover:opacity-50"
    >
      {' '}
      X
      {' '}
    </StyledButton>
  );
}
