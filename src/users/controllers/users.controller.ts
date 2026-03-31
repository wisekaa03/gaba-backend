import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  createUserSchema,
  CreateUserInput,
  listUsersQuerySchema,
  ListUsersQueryInput,
} from '@/users/schemas/users.zod';
import { UsersService } from '@/users/users.service';
import { uuidSchema } from '@/common/utils/zod.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body(new ZodValidationPipe(createUserSchema)) body: CreateUserInput) {
    return this.usersService.create(body);
  }

  @Get()
  list(
    @Query(new ZodValidationPipe(listUsersQuerySchema))
    query: ListUsersQueryInput,
  ) {
    return this.usersService.list(query);
  }

  @Get(':id')
  getById(@Param('id', new ZodValidationPipe(uuidSchema)) id: string) {
    return this.usersService.getById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id', new ZodValidationPipe(uuidSchema)) id: string) {
    return this.usersService.delete(id);
  }
}
