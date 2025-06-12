import mongoose from 'mongoose' 

const TaskScheme = new mongoose.Schema(
  {
    title: {
			type: String,
			maxLength: 30
		},
    description: {
			type: String
		},
		isComplete: {
			type: Boolean,
			required: true,
			default: false
		},
  }, {
			timestamps: true  // createdAt, updatedAt 속성 자동 생성
	})

const Task = mongoose.model('Task',TaskScheme) // MongoDB: tasks

export default Task
