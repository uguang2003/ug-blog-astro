/**
 * @description: 后端接口客户端。Build 时由 Astro getStaticPaths 调用拉取数据。
 *               BASE URL 通过 PUBLIC_API_BASE_URL 环境变量覆盖，缺省走线上域名。
 * @author: UG - 一个斗码大陆苦逼的三段码之气的少年，并没有神秘戒指中码老的帮助，但总有一天，我会成为斗码大陆中码帝一样的存在。三十年河东，三十年河西，莫欺少年穷。
 * @date: 2026-04-25
 */

const RAW_BASE = import.meta.env.PUBLIC_API_BASE_URL;
if (!RAW_BASE) {
  throw new Error(
    '环境变量 PUBLIC_API_BASE_URL 未设置：请在项目根目录创建 .env 并填入后端地址，例如 PUBLIC_API_BASE_URL=https://api.blog.ug666.top',
  );
}
export const API_BASE = RAW_BASE.replace(/\/$/, '');

export interface BlogSummary {
  id: number;
  title: string | null;
  description: string | null;
  firstPicture: string | null;
  createTime: string | null;
  updateTime: string | null;
  views: number | null;
  recommend: boolean;
  published: boolean;
  flag: string | null;
  commentCount: number | null;
  type: { id: number; name: string } | null;
  user: {
    id: number;
    username: string | null;
    nickname: string | null;
    avatar: string | null;
  } | null;
}

export interface BlogDetail extends BlogSummary {
  content: string | null;
  appreciation: boolean;
  commentabled: boolean;
  shareStatement: boolean;
}

export interface BlogListResponse {
  blogs: BlogSummary[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface Picture {
  id: number;
  pictureAddress: string | null;
  pictureName: string | null;
  pictureDescription: string | null;
  pictureTime: string | null;
}

async function request<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[API] ${res.status} ${res.statusText}: ${url}`);
  }
  return (await res.json()) as T;
}

/** 拉取所有已发布博客（自动翻页直到取完） */
export async function fetchAllBlogs(): Promise<BlogSummary[]> {
  const all: BlogSummary[] = [];
  let page = 1;
  const limit = 100;
  while (true) {
    const data = await request<BlogListResponse>(
      `/api/blogs?page=${page}&limit=${limit}`,
    );
    all.push(...data.blogs);
    if (page >= data.pagination.pages || data.blogs.length === 0) break;
    page++;
  }
  // 仅保留 published 的，前端列表不展示草稿
  return all.filter((b) => b.published);
}

export async function fetchBlogById(id: number | string): Promise<BlogDetail> {
  return request<BlogDetail>(`/api/blogs/${id}`);
}

export async function fetchAllPictures(): Promise<Picture[]> {
  return request<Picture[]>('/api/pictures');
}
