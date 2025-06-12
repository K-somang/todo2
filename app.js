import * as dotenv from 'dotenv'
import express from 'express'
import mongoose from "mongoose"
import mockTasks from './data/mock.js'
import Task from './models/Task.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express())

const asyncHandler = (hadler) => {
	return async (req, res) => {
		try {
			await hadler(req, res)
		} catch(error) {
			// console.log(error.name)
			// console.log(error.message)
			if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else if (error.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: error.message });
      }
		}
	}
}

app.get('/tasks', asyncHandler(async (req, res) => {
	const sort = req.query.sort
  const count = Number(req.query.count) || 0;
  const sortOption = {
	  createdAt: sort === 'oldest' ? 'asc' : 'desc'
  }
  
  const tasks = await Task.find().sort(sortOption).limit(count);
  res.send(tasks)
}))

app.get('/tasks/:id', asyncHandler(async (req, res) => {
	const id = req.params.id // MongoDB의 id는 문자열
  const task = await Task.findById(id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
}))

app.post('/tasks', asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.send(task);
}))

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
	const taskId = req.params.id
	const task = await Task.findById(taskId)
	
	if (task) {
		Object.keys(req.body).forEach((keyName) => {
			task[keyName] = req.body[keyName]
		})
		await task.save()
		res.send(task)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
}))

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
	const taskId = req.params.id
	const task = await Task.findByIdAndDelete(taskId)
	
	if (task) {
		res.sendStatus(204)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
}))

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));