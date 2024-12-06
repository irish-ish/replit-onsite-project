import { UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type RequestOptions = {
  axios: any;
};

export type QueryOptions<TData, TError = AxiosError<Error>> = Omit<
  UseQueryOptions<TData, TError, TData, string[]>,
  'queryKey' | 'queryFn'
>;
