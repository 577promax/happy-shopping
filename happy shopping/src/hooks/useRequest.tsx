import { useState, useRef, useCallback, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from '../utils/message';

// 默认请求参数
const defaultRequestConfig = {
  url: '/', method: 'GET', data: {}, params: {}
}

function useRequest<T>(
  options: AxiosRequestConfig & { manual?: boolean } = defaultRequestConfig
) {
  const navigate = useNavigate();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());

  const cancel = () => {
    controllerRef.current.abort();
  }

  const request = useCallback((requestOptions: AxiosRequestConfig) => {
    // 清空之前的请求状态和数据
    setData(null);
    setError('');
    setLoaded(false);

    // 发请求时，携带登陆 token 给后端
    const loginToken = localStorage.getItem('token');
    const headers = loginToken ? {
      token: loginToken,
    } : {};

    // 发送请求
    return axios.request<T>({
      url: requestOptions.url,
      method: requestOptions.method,
      signal: controllerRef.current.signal,
      data: requestOptions.data,
      params: requestOptions.params,
      headers
    }).then(response => {
      setData(response.data);
      return response.data;
    }).catch((e: any) => {
      if (e?.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError(e.message || 'unknown request error.');
      throw new Error(e);
    }).finally(() => {
      setLoaded(true);
    });
  }, [navigate]);

  useEffect(() => {
    if (!options.manual) {
      request(options).catch(e => {
        message(e?.message);
      })
    }
  }, [options, request]);

  return { data, error, loaded, request, cancel }
}

export default useRequest;