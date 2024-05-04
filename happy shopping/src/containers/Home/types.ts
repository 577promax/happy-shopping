
export type LocationType = {
  id: string,
  address: string;
};

export type BannersType = Array<{
  id: string,
  imgUrl: string;
}>

export type CategoriesType = Array<{
  id: string,
  name: string,
  imgUrl: string;
}>

export type CardListType = Array<{
  id: string,
  name: string,
  imgUrl: string,
  price: string;
}>


export type ResponseType = {
  success: boolean,
  data: {
    location: LocationType,
    banners: BannersType;
    categories: CategoriesType;
    freshes: CardListType;
  }
}