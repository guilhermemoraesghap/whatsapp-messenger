import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            findUnique: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto = {
        name: 'company test',
        cnpj: '11111111111111',
      };

      const userId = '1';

      const user = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'password',
        type: 'user',
        companyId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const companyCreated = {
        ...createCompanyDto,
        id: '1',
        userId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);
      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(prismaService.company, 'create')
        .mockResolvedValueOnce(companyCreated);

      const result = await service.create(createCompanyDto);

      expect(result).toEqual(companyCreated);
    });

    it('should throw ConflictException if company already exists', async () => {
      const createCompanyDto = {
        name: 'company test',
        cnpj: '11111111111111',
      };

      const companyCreated = {
        ...createCompanyDto,
        id: '1',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(companyCreated);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto = {
        name: 'company test',
        cnpj: '11111111111111',
      };

      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const companyUpdated = {
        ...updateCompanyDto,
        id: '1',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = {
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
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);

      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);

      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(null);

      jest
        .spyOn(prismaService.company, 'update')
        .mockResolvedValueOnce(companyUpdated);

      const result = await service.update(
        company.id,
        user.id,
        updateCompanyDto,
      );

      expect(result).toEqual(companyUpdated);
    });

    it('should throw NotFoundException if company does not exist', async () => {
      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(
        service.update('1', '1', { name: 'new name', cnpj: '12345678901234' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.update('1', '1', { name: 'new name', cnpj: '12345678901234' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user does not belong to the company', async () => {
      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = {
        id: '2',
        email: 'existing@example.com',
        name: 'Test',
        password: 'password',
        type: 'user',
        companyId: '2',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);

      await expect(
        service.update('1', '2', { name: 'new name', cnpj: '12345678901234' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if CNPJ already exists', async () => {
      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const user = {
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
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);
      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);

      await expect(
        service.update('1', '1', { name: 'new name', cnpj: '11111111111111' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('listCompany', () => {
    it('should list company', async () => {
      const userId = '1';

      const user = {
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

      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findById').mockResolvedValueOnce(user);
      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValueOnce(company);

      const result = await service.listCompany(userId);

      expect(result).toEqual(company);
    });
  });
});
