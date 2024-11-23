'use client'

import { FC, useState } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { ButtonCircle, Input } from 'ui'

interface Props {
    className?: string
}

const AddSubscriberForm: FC<Props> = ({ className = '' }) => {
    const [email, setemail] = useState('')

    return (
        <form
            className={`relative ${className}`}
            onSubmit={(e) => {
                e.preventDefault()
                if (!email) {
                    return
                }
                // regex check email validation
                if (
                    !email.match(
                        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    )
                ) {
                    return
                }
            }}
        >
            <div className="relative">
                <Input
                    required
                    aria-required
                    placeholder={'Enter you email'}
                    type="email"
                    onChange={(e) => setemail(e.target.value)}
                />
                <ButtonCircle
                    type="submit"
                    className="absolute end-1 top-1/2 -translate-y-1/2 transform dark:bg-neutral-300 dark:text-black"
                >
                    <ArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
                </ButtonCircle>
            </div>
        </form>
    )
}

export default AddSubscriberForm
