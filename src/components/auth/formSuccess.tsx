
import { BsCheckSquare } from "react-icons/bs";

interface FormSuccessProps{
    message?:string;
}

export const FormSuccess = ({message}:FormSuccessProps) => {
    if(!message){
        return null;
    }

    if(message){
        return (
            <div className="bg-emerald-500/15 p-2.5 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                <BsCheckSquare className="h-4 w-4"/>
                <p>{message}</p>
            </div>
        )
    }
}