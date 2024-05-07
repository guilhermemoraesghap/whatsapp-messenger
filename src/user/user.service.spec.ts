import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
        type: 'user',
      };
      const createdUser = {
        ...createUserDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(service['prisma'].user, 'create')
        .mockResolvedValueOnce(createdUser);

      const result = await service.create(createUserDto, 'admin');
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        id: '1',
        email: 'existing@example.com',
        name: 'Test',
        password: 'password',
        type: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(createUserDto);

      await expect(service.create(createUserDto, 'admin')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userId = '123';
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const existingUser = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'password',
        type: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(existingUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(null);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual({
        ...existingUser,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'nonexistent';
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const userId = '1';
      const user = {
        id: userId,
        name: 'Test',
        email: 'test@example.com',
        type: 'user',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(user);

      const result = await service.findById(userId);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
