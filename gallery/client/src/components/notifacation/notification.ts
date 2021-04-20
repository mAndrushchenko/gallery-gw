import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { Icon } from "./Icon"

export const notification = (message: string) => {
    store.addNotification({
        content: Icon({ message }),
        type: "danger",
        container: "bottom-right",
        insert: "bottom",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        slidingEnter: {
            duration: 300,
            delay: 0
        },
        slidingExit: {
            duration: 200,
            delay: 0
        },
        dismiss: {
            duration: 10*1000,
        },
        width: 400
    })
}