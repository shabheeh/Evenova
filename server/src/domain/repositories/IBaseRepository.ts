import { Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findMany(filter: FilterQuery<T>, limit?: number, skip?: number): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, updates: UpdateQuery<T>): Promise<T | null>;
  exists(filter: FilterQuery<T>): Promise<boolean>;
  // count(filter: FilterQuery<T>): Promise<number>;
}
