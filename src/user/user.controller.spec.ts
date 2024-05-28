import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUser } from '../auth/jwt/current-user';
import { EmailService } from '../email/email.service';
import { CompanyService } from '../company/company.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, EmailService, CompanyService],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        companyId: '1',
      };

      const responseMock: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userCreated = {
        ...createUserDto,
        id: '123',
        type: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'create').mockResolvedValue(userCreated);

      const authenticatedUser: AuthUser = { id: '1', type: 'admin' };

      await controller.create(
        createUserDto,
        responseMock as Response,
        authenticatedUser,
      );

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseMock.json).toHaveBeenCalledWith(userCreated);
    });
  });
  describe('update', () => {
    it('should update the user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        name: 'Updated Name',
      };

      const userId = '123';

      const currentUser = { id: userId, type: 'admin' };

      const responseMock: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const userUpdated = {
        ...updateUserDto,
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'user',
        password: 'password',
        companyId: '1',
        isActive: true,
      };

      jest.spyOn(userService, 'update').mockResolvedValue(userUpdated);

      await controller.update(
        currentUser,
        updateUserDto,
        responseMock as Response,
      );

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith(userUpdated);
    });
  });
  describe('findMe', () => {
    it('should return the authenticated user', async () => {
      const userFound = {
        id: '1',
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'password',
        type: 'user',
        companyId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findById').mockResolvedValue(userFound);

      const authenticatedUser: AuthUser = { id: '1', type: 'admin' };
      const result = await controller.findMe(authenticatedUser);

      expect(userService.findById).toHaveBeenCalledWith('1');

      expect(result).toEqual(userFound);
    });
  });
});
