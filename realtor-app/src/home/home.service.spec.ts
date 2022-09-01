import { PropertyType } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService, homeSelect } from './home.service';

const mockHome = {
  id: 1,
  address: '2345 William Str',
  city: 'Toronto',
  price: 1500000,
  property_type: PropertyType.RESIDENTIAL,
  image: 'src1',
  number_of_bedrooms: 3,
  number_of_bathrooms: 2.5,
};

const mockImages = [
  { id: 1, url: 'src1' },
  { id: 2, url: 'src2' },
];

const mockHomes = [
  {
    ...mockHome,
    images: [...mockImages],
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw not found exception if no homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    const mockCreateHomeParams = {
      address: 'Gata 1',
      numberOfBathrooms: 1,
      numberOfBedrooms: 2,
      city: 'Byen',
      landSize: 123,
      price: 456,
      propertyType: PropertyType.RESIDENTIAL,
      images: mockImages,
    };
    it('should call prisma home.create with the currrent payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);
      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);
      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: 'Gata 1',
          number_of_bathrooms: 1,
          number_of_bedrooms: 2,
          city: 'Byen',
          land_size: 123,
          price: 456,
          propertyType: PropertyType.RESIDENTIAL,
          realtor_id: 1,
        },
      });
    });
    it('should call prisma image.createMany with the currrent payload', async () => {
      const mockCreateManyImages = jest.fn().mockReturnValue(mockImages);
      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImages);
      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateManyImages).toBeCalledWith({
        data: [
          { id: 1, url: 'src1', home_id: 1 },
          { id: 2, url: 'src2', home_id: 1 },
        ],
      });
    });
  });
});
