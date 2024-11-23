import { Menu, Transition, Dialog } from '@headlessui/react'
import { Editor } from '@tiptap/react'
import React, { FC, Fragment, useState, ReactNode, useEffect } from 'react'
import { TiptapBarItem } from './MenuBar'
import MenuItem from './MenuItem'
import soundcloudImg from '@/images/logos/SoundCloud.png'
import sketchfabImg from '@/images/logos/Sketchfab.png'
import twitchImg from '@/images/logos/Twitch.png'
import appleMusicImg from '@/images/logos/Apple_Music.png'
import figmaImg from '@/images/logos/Figma.png'
import githubLightImg from '@/images/logos/GithubLight.png'
import githubDarkImg from '@/images/logos/GithubDark.png'
import codepenDarkImg from '@/images/logos/CodePenDark.png'
import codepenLightImg from '@/images/logos/CodePenLight.png'
import facebookImg from '@/images/logos/Facebook.png'
import spotifyImg from '@/images/logos/Spotify.png'
import instagramImg from '@/images/logos/Instagram.png'
import flickrImg from '@/images/logos/Flickr.png'
import giphyImg from '@/images/logos/Giphy.png'
import youtubeImg from '@/images/logos/Youtube.png'
import Image from 'next/image'
import SpotifyModal from './extensions/iframes/SpotifyModal'
import InstagramModal from './extensions/iframes/InstagramModal'
import FacebookModal from './extensions/iframes/FacebookModal'
import SoundCloudModal from './extensions/iframes/SoundCloudModal'
import GistModal from './extensions/iframes/GithubModal'
import AppleMusicModal from './extensions/iframes/AppleMusicModal'
import { useThemeMode } from '@/hooks/useThemeMode'
import FlickrModal from './extensions/iframes/FlickrModal'
import CodePenModal from './extensions/iframes/CodePenModal'
import FigmaModal from './extensions/iframes/FigmaModal'
import SketchfabModal from './extensions/iframes/SketchfabModal'
import TwitchModal from './extensions/iframes/TwitchModal'

interface Props {
    icon: ReactNode
    title: string
    action: (args?: any) => void
    isActive?: () => boolean
    editor: Editor
}

const MenuItemSocials: FC<Props> = ({
    action,
    icon,
    title,
    isActive,
    editor,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [modalOption, setModalOption] = useState<string | null>(null)

    const theme = useThemeMode()

    const [headingItem] = useState<TiptapBarItem[]>([
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-orange-100 dark:bg-orange-950 p-0.5">
                    <Image
                        src={soundcloudImg}
                        alt="SoundCloud"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'SoundCloud',
            action: () => setModalOption('soundcloud'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-900 p-0.5">
                    <Image
                        src={facebookImg}
                        alt="Facebook"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'Facebook',
            action: () => setModalOption('facebook'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-red-100 dark:bg-red-900 p-0.5">
                    <Image
                        src={youtubeImg}
                        alt="YouTube"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'YouTube',
            action: () => setModalOption('youtube'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-1">
                    {theme.isDarkMode ? (
                        <Image
                            src={githubDarkImg}
                            alt="GitHub Gist"
                            className="scale-75"
                        />
                    ) : (
                        <Image
                            src={githubLightImg}
                            alt="GitHub Gist"
                            className="scale-75"
                        />
                    )}
                </div>
            ),
            title: 'GitHub Gist',
            action: () => setModalOption('github'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-950 p-1">
                    {theme.isDarkMode ? (
                        <Image
                            src={codepenDarkImg}
                            alt="CodePen"
                            className="scale-75"
                        />
                    ) : (
                        <Image
                            src={codepenLightImg}
                            alt="CodePen"
                            className="scale-75"
                        />
                    )}
                </div>
            ),
            title: 'CodePen',
            action: () => setModalOption('codepen'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-pink-100 dark:bg-pink-900 p-1">
                    <Image
                        src={instagramImg}
                        alt="Instagram"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'Instagram',
            action: () => setModalOption('instagram'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-green-100 dark:bg-green-950 p-1">
                    <Image
                        src={spotifyImg}
                        alt="Spotify"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'Spotify',
            action: () => setModalOption('spotify'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-red-100 dark:bg-red-950 p-1">
                    <Image
                        src={appleMusicImg}
                        alt="Apple Music"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'Apple Music',
            action: () => setModalOption('apple-music'),
            isActive: () => editor.isActive('heading', { level: 6 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-purple-100 dark:bg-purple-950 p-1">
                    <Image src={twitchImg} alt="Twitch" className="scale-75" />
                </div>
            ),
            title: 'Twitch',
            action: () => setModalOption('twitch'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-950 p-1">
                    <Image
                        src={sketchfabImg}
                        alt="Sketchfab"
                        className="scale-75"
                    />
                </div>
            ),
            title: 'Sketchfab',
            action: () => setModalOption('sketchfab'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-green-100 dark:bg-green-950 p-2">
                    <Image src={figmaImg} alt="Figma" className="scale-85" />
                </div>
            ),
            title: 'Figma',
            action: () => setModalOption('figma'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-100 dark:bg-blue-950 p-1">
                    <Image src={flickrImg} alt="Flickr" className="scale-75" />
                </div>
            ),
            title: 'Flickr',
            action: () => setModalOption('flickr'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
        {
            icon: (
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-purple-100 dark:bg-purple-950 p-1">
                    <Image src={giphyImg} alt="Giphy" className="scale-75" />
                </div>
            ),
            title: 'Giphy',
            action: () => setModalOption('giphy'),
            isActive: () => editor.isActive('heading', { level: 5 }),
        },
    ])

    const openDrawer = () => setIsDrawerOpen(true)
    const closeDrawer = () => setIsDrawerOpen(false)

    const handleClick = (action: () => void, onClose: () => void) => {
        return () => {
            action()
            onClose()
        }
    }

    return (
        <>
            {/* For larger screens: Render Menu */}
            <div className="hidden sm:block">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button as={'div'}>
                        <MenuItem
                            icon={icon}
                            title={title}
                            isActive={isActive}
                            action={action}
                        />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="focus:outline-none absolute left-1/2 transform -translate-x-1/2 mt-3 w-52 origin-top rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 max-h-[340px] overflow-y-auto">
                            <div className="p-3 space-y-1">
                                {headingItem.map((item) => (
                                    <Menu.Item key={item.title}>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ||
                                                    (item.isActive &&
                                                        item.isActive())
                                                        ? 'bg-primary-100 dark:bg-neutral-700 text-primary-900'
                                                        : ''
                                                } p-2 flex w-full items-center rounded-lg text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900`}
                                                onClick={item.action}
                                                type="button"
                                            >
                                                {item.icon}
                                                <span className="ml-4 text-sm">
                                                    {item.title}
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            {/* For mobile: Render Drawer */}
            <div className="block sm:hidden">
                <MenuItem
                    icon={icon}
                    title={title}
                    isActive={isActive}
                    action={openDrawer}
                />

                <Transition show={isDrawerOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-50 overflow-hidden"
                        onClose={closeDrawer}
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Background overlay */}
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                {/* <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" /> */}
                            </Transition.Child>

                            {/* Drawer content */}
                            <div className="fixed inset-x-0 bottom-0 max-h-full flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-0"
                                    leaveTo="translate-y-full"
                                >
                                    <Dialog.Panel className="w-screen max-h-96 bg-white dark:bg-neutral-800 shadow-xl rounded-t-2xl">
                                        <div className="h-full flex flex-col py-4">
                                            {/* Close button */}
                                            <div className="flex justify-end px-4">
                                                <button
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                    onClick={closeDrawer}
                                                >
                                                    <span className="sr-only">
                                                        Close
                                                    </span>
                                                    <svg
                                                        className="h-6 w-6"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Drawer items */}
                                            <div className="mt-4 flex-1 overflow-y-auto px-4 grid grid-cols-2 gap-2">
                                                {headingItem.map((item) => (
                                                    <button
                                                        key={item.title}
                                                        className={`${
                                                            item.isActive &&
                                                            item.isActive()
                                                                ? 'bg-primary-100 dark:bg-neutral-700 text-primary-900'
                                                                : ''
                                                        } p-2 flex w-full items-center rounded-lg text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-700 hover:text-primary-900`}
                                                        onClick={handleClick(
                                                            item.action,
                                                            closeDrawer
                                                        )}
                                                        type="button"
                                                    >
                                                        {item.icon}
                                                        <span className="ml-4">
                                                            {item.title}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
            {/* Check if the modal option matches */}
            <SpotifyModal
                show={modalOption === 'spotify'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <InstagramModal
                show={modalOption === 'instagram'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <SoundCloudModal
                show={modalOption === 'soundcloud'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <FacebookModal
                show={modalOption === 'facebook'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <GistModal
                show={modalOption === 'github'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <AppleMusicModal
                show={modalOption === 'apple-music'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <CodePenModal
                show={modalOption === 'codepen'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <FlickrModal
                show={modalOption === 'flickr'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <FigmaModal
                show={modalOption === 'figma'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <SketchfabModal
                show={modalOption === 'sketchfab'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
            <TwitchModal
                show={modalOption === 'twitch'}
                onCloseModal={() => {
                    setModalOption(null)
                }}
                onSubmit={(value) => {
                    if (!!value) {
                        editor.chain().focus().setIframe({ src: value }).run()
                    }
                }}
            />
        </>
    )
}

export default MenuItemSocials
