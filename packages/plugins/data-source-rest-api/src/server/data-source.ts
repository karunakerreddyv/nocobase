import { DataSource } from '@nocobase/data-source-manager';
import axios from 'axios';

export class RestApiDataSource extends DataSource {
  get api() {
    return axios.create({
      baseURL: this.options.baseURL,
    });
  }

  async getTables() {
    return ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];
  }

  async getTable(name: string) {
    const fields = await this.getFields(name);
    return {
      name,
      fields,
    };
  }

  async getFields(name: string) {
    const response = await this.api.get(`/${name}/1`);
    return Object.keys(response.data).map((key) => ({
      name: key,
      type: 'string', // a default type
    }));
  }

  async find(collection: string, options: any) {
    const { limit, offset } = options;
    const response = await this.api.get(`/${collection}`, {
      params: {
        _limit: limit,
        _start: offset,
      },
    });
    return response.data;
  }

  async findOne(collection: string, options: any) {
    const { where } = options;
    const response = await this.api.get(`/${collection}/${where.id}`);
    return response.data;
  }

  async create(collection: string, options: any) {
    const { values } = options;
    const response = await this.api.post(`/${collection}`, values);
    return response.data;
  }

  async update(collection: string, options: any) {
    const { where, values } = options;
    const response = await this.api.put(`/${collection}/${where.id}`, values);
    return response.data;
  }

  async destroy(collection: string, options: any) {
    const { where } = options;
    await this.api.delete(`/${collection}/${where.id}`);
    return {};
  }
}

export default RestApiDataSource;
