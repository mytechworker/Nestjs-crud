import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Task } from './schemas/task.schema';

import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
  ) {}

  async findAll(query: Query): Promise<Task[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const tasks = await this.taskModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return tasks;
  }

  async create(task: Task, user: User): Promise<Task> {
    const data = Object.assign(task, { user: user._id });

    const res = await this.taskModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Task> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    return task;
  }

  async updateById(id: string, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Task> {
    return await this.taskModel.findByIdAndDelete(id);
  }

  async findTasksByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel.find({ user: userId });
    return tasks;
  }
}
