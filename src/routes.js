import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const searchObj = search ? {
        title: search
      } : null

      const tasks = database.select('tasks', searchObj)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      database.insert('tasks', task)      

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      task.title = title
      task.description = description
      task.updated_at = new Date().toISOString()

      database.update('tasks', id, task)      

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

        const isTaskCompleted = !!task.completed_at
        task.completed_at = isTaskCompleted ? null : new Date().toISOString()
        task.updated_at = new Date().toISOString()

      database.update('tasks', id, task)      

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', {id})

      if (!task) {
        return res.writeHead(404).end()
      }

      database.delete('tasks', id)      

      return res.writeHead(204).end()
    }
  },
]