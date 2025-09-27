import Link from 'next/link'

export default function Home() {
  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
        <header className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800 text-center'>
            My Todo App
          </h1>
          <p className='text-gray-600 text-center mt-2'>
            Stay organized with your daily tasks
          </p>
        </header>

        <main>
          {/* Navigation to todo page */}
          <div className='mb-6 text-center'>
            <Link 
              href="/todo" 
              className='inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
            >
              Go to Todo List
            </Link>
          </div>

          {/* Todo input form will go here */}
          <div className='mb-6'>
            <p className='text-gray-500 text-center'>
              Todo form component will be added here
            </p>
          </div>

          {/* Todo list will go here */}
          <div>
            <p className='text-gray-500 text-center'>
              Todo list component will be added here
            </p>
          </div>
        </main>

        <footer className='mt-8 pt-4 border-t border-gray-200'>
          <p className='text-xs text-gray-400 text-center'>
            Built with Next.js & TypeScript
          </p>
        </footer>
      </div>
    </div>
  )
}