import classNames from 'classnames';
import { HTMLProps } from 'react';

export function EmpP({ className, ...props }: HTMLProps<HTMLParagraphElement>) {
  return <p {...props} className={classNames('first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-primary', className)} />;
}
