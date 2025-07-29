import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string> = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }
  sort(): this {
    const rawSort = this.query?.sort;

    if (typeof rawSort === "string" && rawSort.trim().length > 0) {
      const sortBy = rawSort.split(",").join(" ");
      this.modelQuery = this.modelQuery.sort(sortBy);
    } else {
      this.modelQuery = this.modelQuery.sort("-createdAt");
    }

    return this;
  }
  fields(): this {
    const fieldsFromQuery = this.query.fields;

    if (
      typeof fieldsFromQuery === "string" &&
      fieldsFromQuery.trim().length > 0
    ) {
      const fieldsArray = fieldsFromQuery.split(",").map((f) => f.trim());
      const sanitizedFields = fieldsArray.filter(
        (field) => field !== "password"
      );
      const finalFields = sanitizedFields.join(" ");
      this.modelQuery = this.modelQuery.select(finalFields);
    } else {
      this.modelQuery = this.modelQuery.select("-password");
    }

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}
