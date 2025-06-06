
import { BsExclamationTriangle } from "react-icons/bs";

interface FormErrorProps{
    message?:string;
}

export const FormError = ({message}:FormErrorProps) => {
    if(!message){
        return null;
    }

    if(message){
        return (
            <div className="bg-destructive/15 p-2.5 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                <BsExclamationTriangle className="h-4 w-4"/>
                <p>{message}</p>
            </div>
        )
    }
}