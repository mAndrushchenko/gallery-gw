import React, { FC } from "react"
import { IIcon } from "../../types/store-types"
import './Icon.scss'


export const Icon: FC<IIcon> = ({message}) => {
    return (
        <div className="custom-icon">
            <img className="error-icon" src={process.env.PUBLIC_URL + '/cross.png'} alt="" draggable={false}/>
            <p className="message">{message}</p>
        </div>
        )

}