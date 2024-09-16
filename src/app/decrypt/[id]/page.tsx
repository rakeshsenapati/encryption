import { getMessage } from '@/actions/auth-action';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { decryptMessage } from '@/lib/encryption';
import Link from 'next/link';
import React from 'react'

const Page = async ({ params: { id } }: { params: { id: string } }) => {
    const message = await getMessage(id);
    if (message.error) return <div>{message.error}</div>
    const decryptedMessage = decryptMessage(message.encryptedMessage);
    return (
        <>
            <div className="text-sm text-center text-zinc-600 mb-3"><p>This document can be read <span className="text-zinc-100">{message.maxViews - message.viewCount}</span> more times.</p></div>
            <div className="min-w-40 max-h-[500px] overflow-auto border border-zinc-700 rounded-md">
                <div className="flex flex-auto ">
                    <div className="flex flex-col h-full mt-0.5">
                        {(decryptedMessage ? decryptedMessage.split('\n').map((_: any, i: number) => i + 1) : [1]).map((line: number) => (<div key={line} className="text-zinc-700 text-base leading-[20px]  mr-2">
                            {line < 10 ? "0" + line : line}
                        </div>))}
                    </div>
                    <Textarea readOnly name="encryptedMessage" value={decryptedMessage} placeholder="PORT=3000" className="w-full p-[2px] text-base bg-transparent border-none outline-none appearance-none text-zinc-100 placeholder-zinc-500 focus:ring-[#1d1c20] active:ring-[#1d1c20] sm:text-sm overflow-hidden min-h-20" ></Textarea>
                </div>

            </div>
            <div className='flex justify-end gap-2 mt-2'>
                <Button className='bg-white hover:bg-white text-black'>Copy</Button>
                <Link href={'/'} ><Button className='bg-black border-white text-white'>Share Another</Button></Link>
            </div>
        </>
    )
}

export default Page