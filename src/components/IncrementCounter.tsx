import { useState } from 'react'

function IncrementCounter() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <div className="relative py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Increment Count +
          </button>
          <p className="mt-4 text-xl text-gray-300">
            Current Count: <span className="font-bold">{count}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default IncrementCounter
