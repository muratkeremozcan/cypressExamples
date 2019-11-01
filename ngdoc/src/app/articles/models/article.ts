export interface IArticle {
  _id: string;
  tags: string[];
  title: string;
  title_lower: string;
  url: string;
  url_lower: string;
  version: string;
  author_name: string;
  author_lower_name: string;
  status: string;
  published_date: Date | string;
  submitted_by_id: number;
  submitted_by_name: string;
  submitted_by_email?: string;
  submitted_date: Date | string;
  type: string;
  rating: number;
}

export interface IFullArticle {
  _id: string;
  tags: string[];
  title: string;
  title_lower: string;
  url: string;
  version: string;
  author_name: string;
  author_lower_name: string;
  status: string;
  published_date: Date;
  submitted_by_id: number;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_by: {
    email: string;
  };
  submitted_date: Date;
  type: string;
  rating: number;
}

export let ContentTypes = [
  { label: 'Blog', value: 'Blog' },
  { label: 'Video', value: 'Video' },
  { label: 'Course', value: 'Course' },
  { label: 'Code/Sample/Application', value: 'Code' },
  { label: 'Other', value: 'Other' }
];
