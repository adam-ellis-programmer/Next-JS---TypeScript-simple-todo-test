'use client'
//  USE <T>
//  USE <T>
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Todo } from '@/types/todo'
import { databases, ID } from '@/lib/appwrite'

const TodoPage = () => {
  // State for the input field -- ** no error without <string>
  const [todoText, setTodoText] = useState<string>('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState<string>('')

  // State for our todos list
  const [todos, setTodos] = useState<Todo[]>([])

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Replace these with your actual IDs from Appwrite
  const DATABASE_ID = 'todos' // Replace with your actual database ID
  const COLLECTION_ID = 'todosdata' // Replace with your todosData collection ID

  // Fetch todos from Appwrite on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await databases.listDocuments<Todo>(
          DATABASE_ID,
          COLLECTION_ID
        )

        // Directly use the response documents since they match our Todo interface
        setTodos(response.documents)

        console.log('Fetched todos:', response.documents)
      } catch (err) {
        console.error('Error fetching todos:', err)
        setError('Failed to fetch todos')
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  //====================================================================================
  //
  //====================================================================================
  // Handle form submission - now saves to Appwrite
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Don't add empty todos
    if (todoText.trim() === '') return

    setLoading(true)
    setError(null)

    try {
      // Create document in Appwrite
      const response = await databases.createDocument<Todo>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(), // Generate unique ID
        {
          todo: todoText.trim(),
          userId: '1', // Changed to string as required by Appwrite
          completed: false,
        }
      )

      //====================================================================================
      //
      //====================================================================================
      // Add the new todo to state
      setTodos((prevTodos) => [...prevTodos, response])
      setTodoText('')

      console.log('Created todo:', response)
    } catch (err) {
      console.error('Error creating todo:', err)
      setError('Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  //====================================================================================
  //
  //====================================================================================
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value)
  }

  //====================================================================================
  //
  //====================================================================================
  // Toggle todo completion - now updates in Appwrite
  const toggleTodo = async (id: string) => {
    const todoToUpdate = todos.find((todo) => todo.$id === id)
    if (!todoToUpdate) return

    setLoading(true)
    setError(null)

    try {
      // Update document in Appwrite
      const response = await databases.updateDocument<Todo>(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          completed: !todoToUpdate.completed,
        }
      )

      // Update local state
      // prettier-ignore
      setTodos((prevTodos) => prevTodos.map((todo) => todo.$id === id ? { ...todo, completed: !todo.completed } : todo ))

      console.log('Updated todo:', response)
    } catch (err) {
      console.error('Error updating todo:', err)
      setError('Failed to update todo')
    } finally {
      setLoading(false)
    }
  }

  //====================================================================================
  //
  //====================================================================================
  // Delete todo - now deletes from Appwrite
  const deleteTodo = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)

      // Remove from local state
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.$id !== id))
      console.log('Deleted todo:', id)
    } catch (err) {
      console.error('Error deleting todo:', err)
      setError('Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  //====================================================================================
  //
  //====================================================================================
  const updateToDo = (id: string) => {
    const todoToEdit = todos.find((todo) => todo.$id === id)
    if (todoToEdit) {
      setEditingId(id)
      setEditText(todoToEdit.todo)
    }
  }

  //====================================================================================
  //
  //====================================================================================
  const handleUpdateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value)
  }

  //====================================================================================
  //
  //====================================================================================
  const saveUpdate = async (id: string) => {
    if (editText.trim() === '') return

    setLoading(true)
    setError(null)

    try {
      // Update document in Appwrite
      const response = await databases.updateDocument<Todo>(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          todo: editText.trim(),
        }
      )

      // Update local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.$id === id ? { ...todo, todo: editText.trim() } : todo
        )
      )

      // Reset editing state
      setEditingId(null)
      setEditText('')

      console.log('Updated todo text:', response)
    } catch (err) {
      console.error('Error updating todo text:', err)
      setError('Failed to update todo text')
    } finally {
      setLoading(false)
    }
  }

  const cancelUpdate = () => {
    setEditingId(null)
    setEditText('')
  }
  return (
    <div className='min-h-screen  py-8'>
      {/* Header Section */}
      <div className='bg-white max-w-[500px] mx-auto text-center mt-10 p-10 rounded-md shadow-lg'>
        <h1 className='text-3xl capitalize font-bold text-gray-800 mb-4'>
          Make Your Todos
        </h1>
        <Link
          href='/'
          className='inline-block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'
        >
          ← Back Home
        </Link>
      </div>

      <div className='max-w-[500px] mx-auto mt-8'>
        {/* Show loading and error states */}
        {loading && (
          <div className='bg-blue-100 p-4 rounded-lg mb-4 text-blue-800'>
            Loading...
          </div>
        )}

        {error && (
          <div className='bg-red-100 p-4 rounded-lg mb-4 text-red-800'>
            {error}
          </div>
        )}

        {/* Todo Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded-lg shadow-lg'
        >
          <div className='flex gap-2'>
            <input
              type='text'
              value={todoText}
              onChange={handleInputChange}
              placeholder='Enter your todo...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              maxLength={100}
              disabled={loading}
            />
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200'
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className='mt-6'>
          {todos.length === 0 ? (
            <div className='bg-white p-6 rounded-lg shadow-lg text-center text-gray-500'>
              {loading ? 'Loading todos...' : 'No todos yet. Add one above!'}
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
              <div className='p-4 bg-gray-50 border-b'>
                <h2 className='text-lg font-semibold text-gray-700'>
                  Your Todos ({todos.length})
                </h2>
              </div>
              <ul className='divide-y divide-gray-200'>
                {todos.map((todo) => (
                  <li key={todo.$id} className='p-4 flex items-center gap-3'>
                    <input
                      type='checkbox'
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.$id)}
                      disabled={loading}
                      className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50'
                    />
                    {/* ================ */}
                    {/* IF EDITING CHECK */}
                    {/* ================ */}
                    {editingId === todo.$id ? (
                      <div className='flex-1 flex gap-2'>
                        <input
                          type='text'
                          value={editText}
                          onChange={handleUpdateText}
                          className='flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveUpdate(todo.$id)
                            if (e.key === 'Escape') cancelUpdate()
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => saveUpdate(todo.$id)}
                          className='text-green-600 hover:text-green-700 font-medium'
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelUpdate}
                          className='text-gray-500 hover:text-gray-700 font-medium'
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.todo}
                      </span>
                    )}

                    <button
                      onClick={() => deleteTodo(todo.$id)}
                      disabled={loading}
                      className='text-red-500 hover:text-red-700 disabled:text-red-300 font-medium transition-colors duration-200'
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => updateToDo(todo.$id)}
                      disabled={loading}
                      className=' hover:text-red-700 disabled:text-red-300 font-medium transition-colors duration-200'
                    >
                      Update
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoPage
