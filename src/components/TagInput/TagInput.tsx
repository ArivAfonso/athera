'use client'

import React, { useState, ChangeEvent, KeyboardEvent } from 'react'

interface TagInputProps {
    tags: string[]
    onChange: (newTags: string[]) => void
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState<string>('')

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newTags = [...tags, inputValue.trim()]
            onChange(newTags)
            setInputValue('')
        }
    }

    const handleTagRemove = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove)
        onChange(newTags)
    }

    return (
        <div className="tag-input">
            <div className="tag-list">
                {tags.map((tag, index) => (
                    <div key={index} className="tag">
                        {tag}
                        <span
                            className="tag-remove"
                            onClick={() => handleTagRemove(tag)}
                        >
                            &#x2716;
                        </span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                className="tag-input-field"
                placeholder="Add tags..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
            />
        </div>
    )
}

export default TagInput
