import { Models } from 'appwrite'

// Interface that extends Appwrite's Document and includes our custom fields
export interface Todo extends Models.Document {
  todo: string         // The todo text
  userId: string       // User ID (string as required by Appwrite)
  completed: boolean   // Completion status
}