import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CompanyService } from '../company/company.service';
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
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: CompanyService,
          useValue: {
            findById: jest.fn(),
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
        companyId: '1',
        isActive: true,
      };
      const createdUser = {
        ...createUserDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin',
        password: 'adminpassword',
        type: 'admin',
        companyId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(createdUser);

      const result = await service.create(createUserDto, adminUser.type);

      expect(result).toEqual(createdUser);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test',
        password: 'password',
        type: 'user',
        companyId: '1',
        isActive: true,
      };

      const regularUser = {
        id: '1',
        email: 'regular@example.com',
        name: 'Regular User',
        password: 'regularpassword',
        type: 'user',
        companyId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(regularUser);

      await expect(
        service.create(createUserDto, regularUser.type),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if name already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        name: 'username',
        password: 'password',
        companyId: '1',
      };

      const user = {
        id: '1',
        email: 'existing1@example.com',
        name: 'username',
        password: 'password',
        type: 'user',
        companyId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(null);

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(user);

      await expect(service.create(createUserDto, 'admin')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        id: '1',
        email: 'existing@example.com',
        name: 'Test',
        password: 'password',
        type: 'user',
        companyId: '1',
        isActive: true,
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
    describe('update', () => {
      it('should update an existing user', async () => {
        const userId = '1';
        const updateUserDto = {
          name: 'Updated Name',
          email: 'updated@example.com',
        };

        const existingUser = {
          id: userId,
          name: 'Old Name',
          email: 'old@example.com',
          password: 'password',
          type: 'user',
          companyId: '1',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedUser = {
          ...existingUser,
          ...updateUserDto,
        };

        jest
          .spyOn(service['prisma'].user, 'findUnique')
          .mockResolvedValueOnce(existingUser);

        jest
          .spyOn(service['prisma'].user, 'update')
          .mockResolvedValue(updatedUser);

        jest.spyOn(service, 'findById').mockResolvedValue(updatedUser);

        const result = await service.update(userId, updateUserDto);

        expect(result).toEqual(updatedUser);
      });

      it('should throw NotFoundException if user does not exist', async () => {
        const userId = 'nonexistent';
        const updateUserDto = {
          name: 'Updated Name',
          email: 'updated@example.com',
        };

        jest
          .spyOn(service['prisma'].user, 'findUnique')
          .mockResolvedValue(null);

        await expect(service.update(userId, updateUserDto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'nonexistent';
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
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
        companyId: '1',
        isActive: true,
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
