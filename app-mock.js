import express from 'express'
import mockTasks from './data/mock.js'

const app = express()
app.use(express.json())

app.get('/tasks', (req, res) => {
	const sort = req.query.sort
	const count = Number(req.query.count)
	
	const compareFn = sort === 'oldest' ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt
	let sortedTasks = mockTasks.sort(compareFn)
	
	if (count) {
		sortedTasks = sortedTasks.slice(0, count)
	}
	
	res.send(sortedTasks)
})

app.get('/tasks/:id', (req, res) => {
	const taskId = Number(req.params.id)
	const task = mockTasks.find((task) => task.id === taskId)
	
	if (task) {
		res.send(task)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
})

app.post('/tasks', (req, res) => {
	const newTask = req.body
	
	const ids = mockTasks.map((task) => task.id)
	newTask.id = Math.max(...ids) + 1
	newTask.isComplete = false
	newTask.createdAt = new Date()
	newTask.updatedAt = new Date()
	
	mockTasks.push(newTask)
	
	res.status(201).send(newTask)
})

app.patch('/tasks/:id', (req, res) => {
	const taskId = Number(req.params.id)
	const task = mockTasks.find((task) => task.id === taskId)
	
	if (task) {
		Object.keys(req.body).forEach((keyName) => {
			task[keyName] = req.body[keyName]
		})
		task.updatedAt = new Date()
		res.send(task)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
})

app.delete('/tasks/:id', (req, res) => {
	const taskId = Number(req.params.id)
	const taskIndex = mockTasks.findIndex((task) => task.id === taskId)
	
	if (taskIndex >= 0) {
		mockTasks.splice(taskIndex, 1)
		res.sendStatus(204)
	} else {
		res.status(404).send(`Cann't find task by given id`)
	}
})

app.listen(3000, () => console.log(`Server Started!`))