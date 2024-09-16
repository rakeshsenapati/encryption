'use client'

import { Button } from "@/components/ui/button"
import { toast } from "sonner";

const CopyButton = ({ message }: { message: string }) => {
    const onClick = () => {
        navigator.clipboard.writeText(message);
        toast("Copied", {
            description: "Document copied to clipboard."
        })
    }
    return (
        <Button className='bg-white hover:bg-white text-black' onClick={onClick}>Copy</Button>
    )
}

export default CopyButton