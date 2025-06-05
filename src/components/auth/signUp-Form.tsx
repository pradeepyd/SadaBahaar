"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import * as z from "zod";


export const SignUpForm = () => {
    const [verifying, setVerifying] = useState(false);
    const { signUp , isLoaded , setActive } = useSignUp();

    const onSubmit = async() => {}

    const handleVerificationSubmit = async() => {

    }
    if(verifying){
        return (
            <h1>hello</h1>
        )
    }
    return (
        <h1>hii</h1>
    )
}