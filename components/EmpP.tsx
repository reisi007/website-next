import classNames from 'classnames';
import { HTMLProps } from 'react';
import { FIRST_LETTER_CLASSES } from './utils/Css';

export function EmpP({ className, ...props }: HTMLProps<HTMLParagraphElement>) {
  return <p {...props} className={classNames(FIRST_LETTER_CLASSES, className)} />;
}
