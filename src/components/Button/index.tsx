import React, { ButtonHTMLAttributes } from 'react';
import '../../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

const Button: React.FC<ButtonProps> = ({ isOutlined = false, ...rest }) => {
    return (
        <button
            className={`button ${isOutlined ? 'outlined' : ''} `}
            {...rest}
        >

        </button>
    )
}

export { Button }