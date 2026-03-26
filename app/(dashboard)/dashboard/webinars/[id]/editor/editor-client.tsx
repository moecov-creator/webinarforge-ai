'use client'

import { useState } from 'react'

export default function EditorClient({ webinarId }: { webinarId: string }) {
  const [script, setScript] = useState('')

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Webinar Script Editor</h1>
        <button
          onClick={() => alert('Saved!')}
          className="bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-2 rounded-lg"
        >
          Save
        </button>
      </div>

      {script === '' ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-gray-400">
          <p>No script found. Generate one first.</p>
          <button
            onClick={() => setScript('# My Webinar Script\n\nStart writing here...')}
            className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Start from scratch
          </button>
        </div>
      ) : (
        <textarea
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm font-mono text-gray-200 resize-none outline-none focus:border-green-500"
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
      )}
    </div>
  )
}
