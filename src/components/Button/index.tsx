import { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';
import './style.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isCancel?: boolean;
}

export function Button({ isCancel = false, isOutlined = false, ...props }: ButtonProps) {

  return (
    <button
      className={
        cx(
          'button',
          { outlined: isOutlined },
          { cancel: isCancel }
        )
      }
      {...props}
    />
  )
}