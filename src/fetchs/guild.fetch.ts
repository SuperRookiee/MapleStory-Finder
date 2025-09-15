import axios from 'axios';
import { IGuildBasic, IGuildId } from '@/interface/guild/IGuild';
import { IGuildResponse } from '@/interface/guild/IGuildResponse';

const callGuildApi = async <T>(endpoint: string, params: Record<string, string>) => {
    const response = await axios.get<IGuildResponse<T>>(`/api/guild/${endpoint}`, {
        params,
    });
    return response.data;
};

export const findGuildId = (guild_name: string) =>
    callGuildApi<IGuildId>('id', { guild_name });

export const findGuildBasic = (oguild: string) =>
    callGuildApi<IGuildBasic>('basic', { oguild });
