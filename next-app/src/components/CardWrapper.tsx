"use client"

import { Card, CardContent, CardDescription, CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { BackButton } from "./back-button";

interface CardWrapperProps{
    children: React.ReactNode;
    titleLabel: string;
    titleDescriptionLabel: string;
    footerDescription:string;
    backButtonHref: string ;
    backButtonLabel:string;
    backButtonDisabled?: boolean;
    onClick?:()=> void;
};

export const CardWrapper = ({
    children,
    titleLabel,
    titleDescriptionLabel,
    footerDescription,
    backButtonLabel,
    backButtonHref,
    backButtonDisabled,
    onClick
}:CardWrapperProps) => {
    return(
        <Card className="w-full max-w-md mx-auto bg-black/40 border-gray-800">
            <CardHeader className="text-center pb-3">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                    {titleLabel}
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                    {titleDescriptionLabel}
                </CardDescription>
            </CardHeader>
            <Separator className="bg-gray-800" />
            <CardContent className="space-y-6 pt-6 px-8 pb-5">
                {children}
            </CardContent>    
                <CardFooter className="px-8 flex items-center justify-center gap-2 text-sm text-gray-400 pt-2">   
                    <span>{footerDescription}</span>
                    <BackButton href={backButtonHref} label={backButtonLabel} onClick={onClick} disabled={backButtonDisabled}>
                    </BackButton>
                </CardFooter>
        </Card>
    )
}