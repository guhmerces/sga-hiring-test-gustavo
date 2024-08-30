export type PaginatedQueryDto = {
  limit?: number;
  page?: number;
}

export type FindTutorialsDto = {
  title: string;
  creationDate: string;
}