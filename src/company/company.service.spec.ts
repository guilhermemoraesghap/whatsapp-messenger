import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ConflictException } from '@nestjs/common';
import { EmailService } from '../email/email.service';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        PrismaService,
        UserService,
        EmailService,
        {
          provide: PrismaService,
          useValue: {
            company: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const companyCreated = {
        ...createCompanyDto,
        id: '1',
        userId,
        companyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].company, 'findUnique')
        .mockResolvedValueOnce(null);

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(user);

      jest
        .spyOn(service['prisma'].company, 'create')
        .mockResolvedValueOnce(companyCreated);

      const result = await service.create(companyCreated);

      expect(result).toEqual(companyCreated);
    });
    it('should throw ConflictException if email already exists', async () => {
      const createCompanyDto = {
        name: 'company test',
        cnpj: '11111111111111',
      };

      const companyCreated = {
        ...createCompanyDto,
        id: '1',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].company, 'findUnique')
        .mockResolvedValueOnce(companyCreated);

      await expect(service.create(createCompanyDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {});

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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const company = {
        id: '1',
        name: 'Company teste',
        cnpj: '11111111111111',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service['prisma'].company, 'findUnique')
        .mockResolvedValueOnce(company);

      jest
        .spyOn(service['prisma'].user, 'findUnique')
        .mockResolvedValueOnce(user);

      const result = await service.listCompany(userId);

      expect(result).toEqual(company);
    });
  });
});
