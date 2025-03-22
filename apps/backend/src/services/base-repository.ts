import mongoose, { Model, ObjectId } from "mongoose";
import NotFoundError from "./not-found-error";

class BaseRepository<T> {
    model: Model<T>;

    constructor(model: Model<T>) {
      this.model = model;
    }

  async getAll(filter: T = null): Promise<T[]> {
    return await this.model.find(filter);
  };

  async getById(id: mongoose.Types.ObjectId): Promise<T> {
    const item = await this.model.findById(id);
    if (item != null) {
      return item;
    } else {
      throw new NotFoundError();
    }
  };

  async create(body: T): Promise<T> {
    return await this.model.create(body);
  };

  async update(id: ObjectId, body: T): Promise<T> {
    const updatedItem = await this.model.findByIdAndUpdate(id, body, { new: true });
    if (updatedItem != null) {
      return updatedItem;
    }
    else {
      throw new NotFoundError();
    }
  };

  async deleteItem(id: mongoose.Types.ObjectId): Promise<void> {
    const deletedItem: T = await this.model.findByIdAndDelete(id);
    if (deletedItem == null) {
      throw new NotFoundError();
    }
  };
}

export default BaseRepository