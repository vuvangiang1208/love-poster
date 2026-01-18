
export interface Achievement {
  id: string;
  title: string;
  subCaption: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string; // Link ảnh trực tiếp (fix trong code)
  imagePrompt: string; // Câu lệnh cho AI nếu không có link ảnh
}

export interface AIPoemResponse {
  poem: string;
  quote: string;
}
