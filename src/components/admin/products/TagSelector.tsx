'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  disabled = false,
}: TagSelectorProps) {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/products/tags?is_active=true');
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag.name)
  );

  const handleAddTag = (tagName: string) => {
    if (disabled || selectedTags.includes(tagName)) return;
    onTagsChange([...selectedTags, tagName]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagName: string) => {
    if (disabled) return;
    onTagsChange(selectedTags.filter((t) => t !== tagName));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleCreateAndAddTag();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleCreateAndAddTag = async () => {
    const tagName = inputValue.trim();
    if (!tagName || selectedTags.includes(tagName)) return;

    // Check if tag exists in suggestions
    const existingTag = tags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
    if (existingTag) {
      handleAddTag(existingTag.name);
      return;
    }

    // Create new tag
    setAdding(true);
    try {
      const response = await fetch('/api/admin/products/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tagName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tag');
      }

      // Add to tags list
      setTags([...tags, data.tag]);
      // Add to selected tags
      onTagsChange([...selectedTags, data.tag.name]);
      // Reset input
      setInputValue('');
      setShowSuggestions(false);
    } catch (error: any) {
      console.error('Error adding tag:', error);
      alert(error.message || 'Failed to add tag');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Tags</Label>
        <p className="text-sm text-gray-500">Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Tags</Label>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tagName) => (
            <span
              key={tagName}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              {tagName}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tagName)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                  aria-label={`Remove ${tagName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Tag Input */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type and press Enter to add tag"
            disabled={disabled || adding}
            className="flex-1"
          />
          {inputValue.trim() && (
            <Button
              type="button"
              onClick={handleCreateAndAddTag}
              disabled={adding || !inputValue.trim()}
              size="sm"
            >
              {adding ? 'Adding...' : <Plus className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredSuggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleAddTag(tag.name)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span>{tag.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}

