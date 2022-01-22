import {
  AnyEntity,
  EntityData,
  FilterQuery,
  FindOneOptions,
  FindOneOrFailOptions,
  FindOptions,
  Loaded,
  New,
  Populate,
  QueryOrderMap,
  DeleteOptions,
  DriverException,
  EntityManager,
  UpdateOptions,
} from '@mikro-orm/core';
import { pick } from 'lodash';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BadRequestError, NotFoundError } from './errors';
import { CountOptions } from '@mikro-orm/core/drivers/IDatabaseDriver';
import { createMappedPropertySet, getStringifiedEntries } from './utils/object';

@Injectable()
export abstract class BaseService<T> {
  protected abstract logger: Logger;
  constructor(private readonly genericRepository: EntityRepository<T>) {
    this.catchError = this.catchError.bind(this);
  }

  private catchError<T>(err: unknown): T {
    this.logger.error(JSON.stringify(err));
    if (err instanceof DriverException) {
      throw new BadRequestError('Database exception');
    }
    throw err;
  }

  findAll<P extends Populate<T> = any>(
    options?: FindOptions<T, P>
  ): Promise<Loaded<T, P>[]>;
  findAll<P extends Populate<T> = any>(
    populate?: P,
    orderBy?: QueryOrderMap,
    limit?: number,
    offset?: number
  ): Promise<Loaded<T, P>[]>;
  async findAll(...args) {
    return this.genericRepository.findAll(...args).catch(this.catchError);
  }

  find<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    options?: FindOptions<T, P>
  ): Promise<Loaded<T, P>[]>;
  find<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    populate?: P,
    orderBy?: QueryOrderMap,
    limit?: number,
    offset?: number
  ): Promise<Loaded<T, P>[]>;
  async find<P extends Populate<T> = any>(
    arg1: FilterQuery<T>,
    arg2: FindOptions<T, P> | P,
    arg3?: QueryOrderMap,
    arg4?: number,
    arg5?: number
  ): Promise<Loaded<T, P>[]> {
    return this.genericRepository
      .find(arg1, arg2, arg3, arg4, arg5)
      .catch<Loaded<T, P>[]>(this.catchError);
  }

  findOne<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    populate?: P,
    orderBy?: QueryOrderMap
  ): Promise<Loaded<T, P> | null>;
  findOne<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    populate?: FindOneOptions<T, P>,
    orderBy?: QueryOrderMap
  ): Promise<Loaded<T, P> | null>;
  async findOne<P extends Populate<T> = any>(
    arg1: FilterQuery<T>,
    arg2?: P | FindOptions<T, P>,
    arg3?: QueryOrderMap
  ): Promise<Loaded<T, P> | null> {
    return this.genericRepository
      .findOne(arg1, arg2, arg3)
      .catch<Loaded<T, P> | null>(this.catchError);
  }

  findOneOrFail<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    populate?: P,
    orderBy?: QueryOrderMap
  ): Promise<Loaded<T, P>>;
  findOneOrFail<P extends Populate<T> = any>(
    where: FilterQuery<T>,
    populate?: FindOneOrFailOptions<T, P>,
    orderBy?: QueryOrderMap
  ): Promise<Loaded<T, P>>;
  async findOneOrFail<P extends Populate<T> = any>(
    arg1: FilterQuery<T>,
    arg2?: P | FindOneOrFailOptions<T, P>,
    arg3?: QueryOrderMap
  ): Promise<Loaded<T, P>> {
    return this.genericRepository
      .findOneOrFail(arg1, arg2, arg3)
      .catch<Loaded<T, P>>(this.catchError);
  }

  create<P extends Populate<T> = string[]>(data: EntityData<T>): New<T, P> {
    return this.genericRepository.create(data);
  }

  async update(
    oldPartialEntity: Partial<T>,
    newPartialEntity: Partial<T>
  ): Promise<T> {
    try {
      const foundEntity = await this.findOne(oldPartialEntity);
      if (!foundEntity) {
        throw new NotFoundException();
      }
      const mergedEntity = Object.assign<T, Partial<T>>(
        foundEntity,
        newPartialEntity
      );
      await this.genericRepository.persistAndFlush(mergedEntity);
      return mergedEntity;
    } catch (err) {
      this.catchError(err);
    }
  }

  async persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void> {
    return this.genericRepository
      .persistAndFlush(entity)
      .catch<void>(this.catchError);
  }

  async save(entity: T): Promise<T> {
    try {
      const mergedEntity = this.genericRepository.create(entity);
      await this.genericRepository.persistAndFlush(mergedEntity);
      return entity;
    } catch (err) {
      this.catchError(err);
    }
  }

  remove(entity: AnyEntity | AnyEntity[]): EntityManager {
    return this.genericRepository.remove(entity);
  }

  public async upsert({
    data,
    where,
    flush = false,
  }: {
    data: EntityData<T>;
    where: FilterQuery<T>;
    flush?: boolean;
  }) {
    try {
      let entity: T = await this.genericRepository.findOne(where);
      if (entity) {
        this.genericRepository.assign(entity, data);
      } else {
        entity = this.genericRepository.create(data);
      }

      if (flush) {
        await this.genericRepository.persistAndFlush(entity);
      } else {
        await this.genericRepository.persist(entity);
      }
      return entity;
    } catch (err) {
      this.catchError(err);
    }
  }

  public async upsertManyFilteredByProperties({
    data,
    propertyList,
    flush = false,
  }: {
    data: EntityData<T>[];
    propertyList: (keyof T)[];
    flush?: boolean;
  }) {
    try {
      const orFilters: Pick<EntityData<T>, keyof T>[] = data.map((datum) =>
        pick(datum, propertyList)
      );

      const where: FilterQuery<T> & {
        $or: Pick<EntityData<T>, keyof T>[];
      } = {
        $or: orFilters,
      };
      const existingEntityList: T[] = await this.genericRepository.find(where);
      const existingEntityMapObj: Record<string, T> = createMappedPropertySet(
        existingEntityList,
        propertyList
      );

      const entityList: T[] = data.map((datum, i) => {
        const key = getStringifiedEntries(orFilters[i]);
        let entity: T = existingEntityMapObj[key];
        if (entity) {
          this.genericRepository.assign(entity, datum);
        } else {
          entity = this.genericRepository.create(datum);
        }

        return entity;
      });

      if (flush) {
        await this.genericRepository.persistAndFlush(entityList);
      } else {
        await this.genericRepository.persist(entityList);
      }

      return entityList;
    } catch (err) {
      this.catchError(err);
    }
  }

  async nativeDelete(
    where: FilterQuery<T>,
    options?: DeleteOptions<T>
  ): Promise<number> {
    return this.genericRepository
      .nativeDelete(where, options)
      .catch<number>(this.catchError);
  }

  persist(entity: AnyEntity | AnyEntity[]): EntityManager {
    return this.genericRepository.persist(entity);
  }

  assign(entity: T, data: EntityData<T>): T {
    return this.genericRepository.assign(entity, data);
  }

  getById(id: string): Promise<T> {
    return this.genericRepository
      .findOneOrFail({ id } as FilterQuery<T>, {
        failHandler: (): any => new NotFoundError('Entity not found'),
      })
      .catch<T>(this.catchError);
  }

  nativeUpdate(
    where: FilterQuery<T>,
    data: EntityData<T>,
    options?: UpdateOptions<T>
  ): Promise<number> {
    return this.genericRepository
      .nativeUpdate(where, data, options)
      .catch<number>(this.catchError);
  }

  flush(): Promise<void> {
    return this.genericRepository.flush().catch<void>(this.catchError);
  }

  count(where?: FilterQuery<T>, options?: CountOptions<T>): Promise<number> {
    return this.genericRepository
      .count(where, options)
      .catch<number>(this.catchError);
  }

  findByIdList(idList: string[]): Promise<T[]> {
    return this.genericRepository
      .find({ id: { $in: idList } } as FilterQuery<T>)
      .catch<T[]>(this.catchError);
  }
}
