import { HTMLAttributes } from 'react';

export type Styleable = Pick<HTMLAttributes<unknown>, 'style' | 'className'>;
