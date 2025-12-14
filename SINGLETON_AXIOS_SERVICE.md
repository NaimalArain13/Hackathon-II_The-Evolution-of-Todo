import axios from 'axios';
import Cookies from 'js-cookie';

const getUrl = (endpoint: string) => `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

const getConfigs = (config: { params: Record<string, unknown> }, endpoint: string, isFormData = false) => {
  const token = Cookies.get('authToken');
  const isLoginEndpoint = endpoint === '/login';

  const headers: Record<string, string> = {
    Accept: '*/*',
    ...(token && !isLoginEndpoint ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/hal+json; charset=utf-8';
  }

  return {
    headers,
    ...config,
  };
};

const request = async (method: string, endpoint: string, payload = {}, params = {}) => {
  try {
    let request;
    if (method === 'post') {
      const isFormData = payload instanceof FormData;
      request = axios.post(
        getUrl(endpoint),
        isFormData ? payload : { ...payload },
        getConfigs({ params }, endpoint, isFormData),
      );
    } else if (method === 'put') {
      const isFormData = payload instanceof FormData;
      request = axios.put(getUrl(endpoint), payload, getConfigs({ params }, endpoint, isFormData));
    } else if (method === 'delete') {
      // For DELETE requests, pass payload in the request body, not query params
      request = axios.delete(getUrl(endpoint), {
        ...getConfigs({ params }, endpoint),
        data: payload,
      });
    } else {
      request = axios.get(getUrl(endpoint), getConfigs({ params }, endpoint));
    }
    const { data } = await request;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove('authToken');
      Cookies.remove('authUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw error;
  }
};

export const get = (endpoint: string, params = {}) => request('get', endpoint, {}, params);
export const post = (endpoint: string, payload = {}, params = {}) => request('post', endpoint, payload, params);
export const callDelete = (endpoint: string, params = {}) => request('delete', endpoint, params, {});
export const put = (endpoint: string, payload = {}, params = {}) => request('put', endpoint, payload, params);

// Special get request for downloading binary files (PDFs, etc.)
export const getBlob = async (endpoint: string, params = {}) => {
  try {
    const token = Cookies.get('authToken');
    const config = {
      headers: {
        Accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      params,
      responseType: 'blob' as const,
    };
    const response = await axios.get(getUrl(endpoint), config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      Cookies.remove('authToken');
      Cookies.remove('authUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    throw error;
  }
};



example usage:
import { ENDPOINTS } from '@/constants/endpoints';
import * as api from '@services/api';

interface AddCommentData {
  status: string;
  commenter: string;
  description: string;
  user: string;
}
export const addComment = async (payload: AddCommentData) => {
  return await api.post(ENDPOINTS.ADD_COMMENT, payload);
};

export const getCommentsList = async (params?: {
  sort: string;
  requester: string;
  commenter: string;
  page: number;
  rowsPerPage: number;
  status?: string | undefined;
  query?: string;
}) => {
  return await api.get(ENDPOINTS.COMMENTS_LIST, params);
};

export const deleteById = async (payload?: { id: string }) => {
  return await api.post(ENDPOINTS.DELETE_COMMENT, { id: payload?.id });
};

export const updateComment = async (params?: {
  status: string;
  description: string;
  id: string;
  commenter: string;
  user: string;
}) => {
  return await api.post(ENDPOINTS.UPDATE_COMMENT, {}, { ...params });
};


example endpoints.ts:
OMMENTS_LIST: 'get/library/comment',
  DELETE_COMMENT: 'delete/library/comment',
  ADD_COMMENT: 'add/library/comment',
  UPDATE_COMMENT: 'update/library/comment',
  GET_SERVICE_PROVIDERS: 'get/service/providers',
  GET_PERMISSIONS: 'get/default/rolesAndPermissions',
  GET_NEXT_AVAILABLE_SLOT: 'next/available/slot',
  MEDIA: 'media',
  TEMPLATE_LISTING: 'admin/get/templates',
  DELETE_TEMPLATE: 'delete/template',