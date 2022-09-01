import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '.prisma/client';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 53,
  name: 'Navn',
  email: 'navn@domene.no',
  phone: '99999999',
};

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

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Drammen', '150000');
      expect(mockGetHomes).toBeCalledWith({
        city: 'Drammen',
        price: {
          gte: 150000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUpdateHomeParams = {
      address: 'Gata 1',
      numberOfBathrooms: 1,
      numberOfBedrooms: 2,
      city: 'Byen',
      landSize: 123,
      price: 456,
      propertyType: PropertyType.RESIDENTIAL,
    };
    const mockUserInfo = { name: 'Navn', id: 1, exp: 1, iat: 1 };

    it("should throw unauth bif realtor didn't create home", async () => {
      expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should update home if realtor is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);
      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);
      await controller.updateHome(5, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 53,
      });
      expect(mockUpdateHome).toBeCalled();
    });
  });
});
