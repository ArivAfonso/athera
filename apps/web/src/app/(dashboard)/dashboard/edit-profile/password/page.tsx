'use client'

import { Alert, Label, ButtonPrimary, Input } from 'ui'
import { createClient } from '@/utils/supabase/client'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

async function updatePassword(data: any) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
    })
    if (error) {
        console.error('Error updating password:', error.message)
        return
    }
    toast.custom((t) => <Alert type="success" message="Password Updated!" />)
}

function PasswordPage() {
    const { handleSubmit, register } = useForm()

    return (
        <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
            <form
                onSubmit={handleSubmit(async (data) => {
                    if (Object.keys(data).length > 0) {
                        await updatePassword(data)
                    }
                })}
                className={`PasswordPage`}
            >
                <div className="space-y-10 sm:space-y-12">
                    <div className="space-y-5 sm:space-y-6 md:sm:space-y-7">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-semibold">
                                Password settings
                            </h2>
                            <span className="block mt-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                                Update your password.
                            </span>
                        </div>
                        <div className="w-24 border-b border-neutral-200 dark:border-neutral-700"></div>
                        {/* ---- */}

                        <div className="ChangePasswordForm__newPass">
                            <Label>New password</Label>
                            <Input
                                required
                                type="password"
                                minLength={6}
                                className="mt-1.5"
                                {...register('newPassword')}
                            />
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Password must be at least 6 characters
                            </span>
                        </div>
                        {/* ---- */}
                        <div className="ChangePasswordForm__ConfirmPass">
                            <Label>Confirm password</Label>
                            <Input
                                required
                                type="password"
                                minLength={6}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-start mt-10 sm:mt-12">
                    <ButtonPrimary type="submit">Update</ButtonPrimary>
                </div>
            </form>
        </div>
    )
}

export default PasswordPage
