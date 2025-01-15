import mongoose, { Model } from "mongoose";
import NotFoundError from "./not-found-error";

class BaseService<T> {
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

  async deleteItem(id: mongoose.Types.ObjectId): Promise<void> {
    const deletedItem: T = await this.model.findByIdAndDelete(id);
    if (deletedItem == null) {
      throw new NotFoundError();
    }
  };
}

export default BaseService