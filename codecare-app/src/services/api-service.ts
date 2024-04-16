import axios from "./axios-config.ts";

export const search = async <T>(path: string, params: any = {}): Promise<T[]> => {
    const query: URLSearchParams = new URLSearchParams(params);
    const response = await axios.get(`/${path}?${query}`);
    return response.data;
};

export const getById = async <T>(path: string, id: string): Promise<T> => {
    const response = await axios.get(`/${path}/${id}`);
    return response.data;
};

export const post = async (path: string, object: any): Promise<any> => {
    const response = await axios.post(`/${path}`, JSON.stringify(object), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const save = async <T>(path: string, object: T): Promise<void> => {
    const response = await axios.post(`/${path}`, JSON.stringify(object), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const update = async <T>(path: string, object: T): Promise<void> => {
    const response = await axios.put(`/${path}/${object.id}`, JSON.stringify(object), {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

export const deleteById = async (path: string, id: string): Promise<void> => {
    const response = await axios.delete(`/${path}/${id}`);
    return response.data;
};
