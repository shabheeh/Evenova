import { IBaseRepository } from '@/domain/repositories/IBaseRepository';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findMany(
    filter: FilterQuery<T>,
    limit?: number,
    skip?: number
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);

    return await query.exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return await doc.save();
  }

  async update(id: string, updates: UpdateQuery<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter).exec();
    return count > 0;
  }
}
