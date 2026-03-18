import React from 'react';

interface BlogPost {
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    category: 'Dinh dưỡng',
    title: 'Hướng dẫn mẹ cách chọn sữa công thức phù hợp cho trẻ sơ sinh',
    description: 'Việc chọn sữa cho bé trong những tháng đầu đời cực kỳ quan trọng để đảm bảo hệ tiêu hóa khỏe mạnh...',
    date: '12 Tháng 5, 2023',
    readTime: '5 phút đọc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKR7K-cAnw5BSrGtm0lbmP0-kF9BwjxSPT8E1BYlX8ZvZRpgoOGsqv8-NANXDRplIEyu3fWyZtcZcISBlzrqe2MbfYYDOOe_f-1ifaa2hvYGaBFnUA2jC6wIjFKcoqy7ITF7zJyPheSqKmT6430UMGTADGpvyEA_q-LsZlEOpXqtxyb3RWww_uqbXHSihbWQN6J0tu-pPz9C3-QhiQHcxMPXbQJ_3cFhn0rjCrvIG6KYeUOzHwIunguM1MuHrb2isfiouXW5457aob',
  },
  {
    category: 'Thai kỳ',
    title: 'Chế độ dinh dưỡng cho mẹ bầu 3 tháng cuối để thai nhi tăng cân chuẩn',
    description: '3 tháng cuối là giai đoạn "nước rút" để bé yêu phát triển toàn diện. Mẹ cần bổ sung gì?',
    date: '10 Tháng 5, 2023',
    readTime: '7 phút đọc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_tvtWSTYiaa6U_jHCSDZEdpH63QmO406C1cW19KPqQXBSXChxHNEIlPm9g2T-8-Sreok2NbFrUU0brpoUsGQxVEbq5ImICclCU62ACzDfPuFfSZuEnLGMHEBH2hyPCRJcyPshJIBfoA5eNvdtJNmW4lsTJKm_K0QdRIvas3Dz05slJ95by_LgVlVXcb8Spkiiju2-zHBfij6hT2hzC9g9voXL2rLx_27RSqYySB878kZItMRqrC13OsZppyXpSETecDHKIsYyPWdo',
  },
  {
    category: 'Ăn dặm',
    title: 'Thực đơn ăn dặm kiểu Nhật cho bé 6 tháng tuổi mới bắt đầu',
    description: 'Gợi ý thực đơn ăn dặm khoa học, giúp bé làm quen với thức ăn thô và phát triển vị giác.',
    date: '08 Tháng 5, 2023',
    readTime: '4 phút đọc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbrQwpVzkCE0WQjCUgAG9NuRYJQIn7604jhnQLXHuIY57-DgZqzg59LSqy71v4n9avvMbxefP6IUvWbVEz5XdWrxLunZAYzdwWsXvsfU-nEic1D1LWvMt-ixHZgqULm7q4FjaCBTuIZBJh4oKnMrLS8bQeMJbgDXl8jev90FGGZjra20_SFv9DKDNOlmrHunUwfle3dJ4uv7O6Yznu-rcKIMDoc-JVG22KVjpcLSGFpoOilB2M2_jO_qkTC4NdO4mq0gNsJJxc_4B_',
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-text-main dark:text-white text-2xl md:text-[28px] font-extrabold leading-tight mb-2">
              Góc chia sẻ kinh nghiệm
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
              Kiến thức bổ ích cho hành trình làm mẹ.
            </p>
          </div>
          <a className="hidden sm:flex text-primary font-bold text-sm hover:underline items-center" href="#">
            Đọc thêm <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="flex flex-col gap-4 group cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-video relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                  {post.category}
                </span>
                <h3 className="text-text-main dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-text-muted dark:text-gray-400 text-sm line-clamp-2">
                  {post.description}
                </p>
                <span className="text-gray-400 text-xs mt-1 font-medium">
                  {post.date} • {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
