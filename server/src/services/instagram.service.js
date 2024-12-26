// In client/src/services/instagram.service.js, add:
export const getBestPostingTimes = async () => {
    const response = await api.get('/posting/best-times');
    return response.data;
  };