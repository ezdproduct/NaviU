// src/utils/dataMapping.ts

// Ánh xạ các khóa từ API Cognitive sang competencyData
export const cognitiveKeyMap: { [key: string]: keyof typeof import('@/data/competencyData').competencyData } = {
  'Logic': 'logic',
  'Ngôn ngữ': 'language',
  'Không gian': 'spatial',
};

// Ánh xạ các khóa từ API EQ sang eqData
export const eqKeyMap: { [key: string]: keyof typeof import('@/data/eqData').eqData } = {
  'Tự nhận thức': 'self_awareness',
  'Tự điều chỉnh': 'self_regulation',
  'Động lực': 'motivation', // Thêm nếu API có trả về
  'Thấu cảm': 'empathy', // Thêm nếu API có trả về
  'Kỹ năng xã hội': 'social_skills', // Thêm nếu API có trả về
};

// Hàm lấy tiêu đề hiển thị cho năng lực nhận thức
export const getCognitiveTitle = (key: string, competencyData: any) => {
  const mappedKey = cognitiveKeyMap[key];
  return mappedKey ? competencyData[mappedKey]?.title : key;
};

// Hàm lấy tiêu đề hiển thị cho trí tuệ cảm xúc
export const getEqTitle = (key: string, eqData: any) => {
  const mappedKey = eqKeyMap[key];
  return mappedKey ? eqData[mappedKey]?.title : key;
};