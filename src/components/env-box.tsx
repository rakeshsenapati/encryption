'use client'
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { encryptMessage } from "@/lib/encryption";
import { calculateExpirationTime } from "@/lib/date";
import { createMessage } from "@/actions/auth-action";
import { Button } from "./ui/button";

const EnvBox = () => {
    const [message, setMessage] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [url, setUrl] = useState("");
    const handleInputChange = (e: any) => {
        setMessage(e.target.value);
    };

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > 1000000) {
            alert("File size is too large. Please upload a file smaller than 1MB.");
            return;
        }

        const reader = new FileReader();

        // Read the file as text
        reader.onload = function (e) {
            const content = e.target?.result;
            setMessage((content as string).replace(/[ '""]/g, ''));
        };

        reader.readAsText(file);  // Read the .env file as text
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(url);
        toast("Copied", {
            description: "Link copied to clipboard"
        })
    };


    const lines = useMemo(() => message ? message.split('\n').map((_, i) => i + 1) : [1], [message]);
    return (
        <>
            <h1 className="py-4 text-5xl font-bold text-center text-transparent bg-gradient-to-t bg-clip-text from-zinc-100/60 to-white">{!url ? 'Encrypt and Share' : 'Share this link with others'}</h1>
            {!submitted ? <form action={async (formData) => {
                formData.set("encryptedMessage", encryptMessage(message));
                formData.set("expirationTime", calculateExpirationTime(formData.get("expirationTime") as string));
                const res = await createMessage(formData);
                if (res.id) {
                    setSubmitted(true);
                    setUrl(window.location.origin + "/decrypt/" + res.id);
                }
            }}>

                <div className="min-w-40  min-h-20 max-h-[500px] overflow-auto border border-zinc-700 rounded-md">
                    <div className="flex flex-auto ">
                        <div className="flex flex-col h-full mt-0.5">
                            {lines.map((line: any) => (<div key={line} className="text-zinc-700 text-base leading-[20px]  mr-2">
                                {line < 10 ? "0" + line : line}
                            </div>))}
                        </div>
                        <Textarea name="encryptedMessage" onChange={handleInputChange} value={message} placeholder="PORT=3000" className="w-full p-[2px] text-base bg-transparent border-none outline-none appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-[#1d1c20] active:ring-[#1d1c20] sm:text-sm overflow-hidden min-h-20" ></Textarea>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:flex-row">
                    <div className="w-full sm:w-1/5">
                        <label
                            className="flex items-center justify-center h-16 px-3 py-2 text-sm whitespace-no-wrap duration-150 border rounded hover:border-zinc-100/80 border-zinc-600 focus:border-zinc-100/80 focus:ring-0 text-zinc-100 hover:text-white hover:cursor-pointer "
                            htmlFor="file_input"
                        >
                            Upload a file
                        </label>
                        <input className="hidden" id="file_input" type="file" onChange={handleFileUpload} />
                    </div>
                    <div className="w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0 ">
                        <label
                            htmlFor="reads"
                            className="block text-xs font-medium text-zinc-100"
                        >
                            READS
                        </label>
                        <Input
                            type="number"
                            name="maxViews"
                            id="reads"
                            className="w-full p-0 text-base bg-transparent border-none outline-none appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-[#1d1c20] active:ring-[#1d1c20] sm:text-sm"
                            defaultValue="5"
                        />
                    </div>
                    <div className="relative w-full h-16 px-3 py-2 duration-150 border rounded sm:w-2/5 hover:border-zinc-100/80 border-zinc-600 focus-within:border-zinc-100/80 focus-within:ring-0 ">
                        <label
                            htmlFor="reads"
                            className="block text-xs font-medium text-zinc-100"
                        >
                            TTL
                        </label>
                        <Select name="expirationTime" >
                            <SelectTrigger className="w-full p-0 text-base bg-transparent border-0 appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-0 active:ring-0 sm:text-sm">
                                <SelectValue placeholder="Expiration" />
                            </SelectTrigger>
                            <SelectContent className="" >
                                <SelectGroup>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="24">24 hour</SelectItem>
                                    <SelectItem value="168">7 days</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button type="submit" disabled={!message} className="w-full mt-4 bg-white hover:bg-white text-black" size={'lg'} >Share</Button>
            </form> : <div className="w-full overflow-auto border border-zinc-700 rounded-md  gap-2 flex justify-between">
                <div className="p-4  ">
                    {url}
                </div>
                <div className="bg-white text-black text-base font-semibold p-4 cursor-pointer" onClick={handleCopyClick}>
                    Copy
                </div>
            </div>}

        </>
    );
};

export default EnvBox;
