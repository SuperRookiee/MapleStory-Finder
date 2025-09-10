import axios from "axios";

export const findCharacterList = async () => {
    const response = await axios.get(`/api/character/list`);
    return response.data;
};