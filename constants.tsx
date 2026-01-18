
import { Achievement } from './types';

// Cập nhật các hình ảnh thành tựu với phong cách họa hình (Anime/Illustration) cực kỳ lãng mạn
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'loved-by-crush',
    title: 'Được yêu người mình thích',
    subCaption: 'THE MAGIC BEGINS',
    description: 'Hạnh phúc nhất không phải là được nhiều người theo đuổi, mà là được người mình thương đáp lại trọn vẹn chân tình.',
    icon: '💖',
    color: 'from-rose-500 to-pink-600',
    // Ảnh 1: Tỏ tình dưới ánh hoàng hôn/sao (Anime)
    imageUrl: '/images/banner_0.png',
    imagePrompt: "Stunning romantic anime illustration of a couple standing on a hill during twilight, petals in the wind, soft glowing lights, deep emotional gaze, Makoto Shinkai style."
  },
  {
    id: 'first-kiss',
    title: 'Được hôn người mình yêu',
    subCaption: 'ETERNAL KISS',
    description: 'Một nụ hôn sâu đậm thay cho ngàn lời hứa, gắn kết hai tâm hồn thành một khối duy nhất không thể tách rời.',
    icon: '💋',
    color: 'from-pink-500 to-rose-600',
    imageUrl: '/images/banner_1.png',
    imagePrompt: "Masterpiece anime art of a couple sharing a passionate and sweet kiss under a cherry blossom tree, glowing atmosphere, cinematic lighting, incredibly romantic."
  },
  {
    id: 'sleeping-together',
    title: 'Cùng nhau chung giấc ngủ',
    subCaption: 'PEACEFUL HOME',
    description: 'Bình yên không phải là thế giới ngoài kia im lặng, mà là khi hai ta ở bên nhau được thấy em bình yên ngủ ngon trong vòng tay anh.',
    icon: '🌙',
    color: 'from-indigo-600 to-purple-700',
    // Ảnh 3: Cặp đôi ôm nhau ngủ (Anime)
    imageUrl: '/images/banner_2.png',
    imagePrompt: "Cozy and warm anime illustration of a couple cuddling together in a sunlit room, sleeping peacefully, soft blankets, aesthetic atmosphere, Ghibli-inspired warmth."
  },
  {
    id: 'one-heartbeat',
    title: '2 con tim cùng chung nhịp đập',
    subCaption: 'SOUL MATES',
    description: 'Khi hai tâm hồn đồng điệu, mọi khoảng cách địa lý hay thử thách gian lao đều trở nên vô nghĩa trước sức mạnh của tình yêu.',
    icon: '💓',
    color: 'from-red-500 to-rose-700',
    // Ảnh 4: Cái ôm sâu sắc (Anime)
    imageUrl: '/images/banner_3.png',
    imagePrompt: "Breathtaking anime digital painting of a couple hugging tightly as silhouettes against a giant glowing moon and stars, magical particles, feeling of eternal love."
  }
];

// Cấu hình cho ảnh Poster chính (Ảnh điện thoại) - Cảnh hôn nhau rực rỡ phong cách Anime
export const MAIN_POSTER_CONFIG = {
  imageUrl: '/images/banner_4.png',
  imagePrompt: 'A breathtaking cinematic wide-shot anime illustration of a couple sharing a long, passionate kiss at a grand sunset balcony overlooking a glowing city, hyper-detailed, emotional masterpiece, vibrant pink and purple clouds.'
};

// "Diễn văn của trái tim" được fix cứng nội dung theo yêu cầu
export const HARDCODED_POEM = {
  poem: "Gửi người anh thương,\n\nNăm 2025 không chỉ là một cột mốc thời gian,\nMà là chương đẹp nhất trong cuốn tiểu thuyết của đời anh.\nTừ khoảnh khắc ta chạm mắt nhau cho đến nụ hôn nồng nàn,\nAnh nhận ra thế giới này chỉ thực sự rực rỡ khi có em.\n\nTừng giấc ngủ yên bình, từng nhịp đập trái tim hòa quyện,\nTất cả đều là minh chứng cho một tình yêu anh dành cho em.\nCảm ơn em vì đã đến, đã ở lại và đã thương anh và yêu anh, \nBằng tất cả chân thành và sự bao dung tuyệt vời nhất.",
  quote: "Cùng nhau, chúng ta sẽ biến năm 2025 và mọi năm sau đó trở thành một hành trình hạnh phúc không bao giờ kết thúc."
};
