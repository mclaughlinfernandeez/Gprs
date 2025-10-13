export interface ScholarPaper {
  title: string;
  authors: { name: string }[];
  year: number;
  url: string;
}

export interface ScholarAPIResponse {
  total: number;
  // The API can return partial data, so properties can be optional
  data: {
    title: string;
    authors: { name: string }[];
    year: number;
    url: string;
  }[];
}
