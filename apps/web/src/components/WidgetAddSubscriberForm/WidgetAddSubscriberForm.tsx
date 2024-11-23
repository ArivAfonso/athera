import { FC } from 'react'
import AddSubscriberForm from './AddSubscriberForm'
import Heading2 from '../Heading2/Heading2'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

interface Props {
    className?: string
}

const WidgetAddSubscriberForm: FC<Props> = ({
    className = 'rounded-3xl border border-neutral-100 dark:border-neutral-700',
}) => {
    return (
        <div className={`WidgetAddSubscriberForm overflow-hidden ${className}`}>
            <Heading2
                title={'Subscribe'}
                icon={<EnvelopeIcon className="h-6 w-6 flex-none" />}
            />
            <div className="p-4 xl:p-5">
                <span className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    Pls subscribe
                </span>
                <div className="mt-4">
                    <AddSubscriberForm />
                </div>
            </div>
        </div>
    )
}

export default WidgetAddSubscriberForm
