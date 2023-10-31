import React, { useState } from 'react'

const CustomTagsInput = ({ value, onChange, name, placeHolder }) => {
    const [tags, setTags] = useState(value)

    const handleInputChange = (event) => {
        if (event.key === 'Enter' && event.target.value) {
            setTags([...tags, event.target.value.trim()])
            onChange([...tags, event.target.value.trim()])
            event.target.value = ''
        }
    }

    const removeTag = (index) => {
        const newTags = [...tags]
        newTags.splice(index, 1)
        setTags(newTags)
        onChange(newTags)
    }

    return (
        <div className="block w-full border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200/50 bg-white dark:border-neutral-500 dark:focus:ring-primary-500/30 dark:bg-neutral-900">
            {tags.map((tag, index) => (
                <div
                    key={index}
                    className="bg-gray-200 rounded-full py-1 px-3 my-1 mx-1 flex items-center"
                >
                    <span>{tag}</span>
                    <button
                        className="text-gray-500 ml-1"
                        onClick={() => removeTag(index)}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <input
                type="text"
                onKeyUp={handleInputChange}
                name={name}
                placeholder={placeHolder}
                className="flex-1 border-none outline-none p-1"
            />
        </div>
    )
}

export default CustomTagsInput
