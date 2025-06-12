import express from 'express'
import mongoose from "mongoose"
import mockTasks from './data/mock.js'
import Task from './models/Task.js'
import { DATABASE_URL } from "./env.js"

const app = express()
app.use(express.json())

await mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'))

app.get('/tasks', async (req, res) => {
    const sort = req.query.sort
    const count = Number(req.query.count)

    const sortOption = {
        createdAt: sort === 'oldest' ? 'asc' : 'desc',
    }

    const tasks = await Task.find().sort(sortOption).limit(count)

    res.send(tasks)
})

app.get('/tasks/:id', async (req, res) => {
	const taskId = req.params.id
    const task = await Task.findById(taskId)
	
	if (task) {
		res.send(task)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
})

app.post('/tasks', async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).send(task)
})

app.patch('/tasks/:id', async (req, res) => {
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
})

app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id
    const task = await Task.findByIdAndDelete(taskId)
    
    if (task) {
        res.sendStatus(204)
    } else {
        res.status(404).send(`Cann't find task by given id`)
    }
})

app.listen(3000, () => console.log(`Server Started!`))