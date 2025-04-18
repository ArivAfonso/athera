export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admins: {
                Row: {
                    created_at: string
                    id: number
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'admins_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            banned_users: {
                Row: {
                    created_at: string
                    email: string
                    id: number
                    reason: string
                }
                Insert: {
                    created_at?: string
                    email: string
                    id?: number
                    reason: string
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: number
                    reason?: string
                }
                Relationships: []
            }
            bookmarks: {
                Row: {
                    created_at: string
                    id: number
                    post: string | null
                    user: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'public_bookmarks_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'public_bookmarks_user_fkey'
                        columns: ['user']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            comment_likes: {
                Row: {
                    comment: number | null
                    created_at: string
                    id: number
                    liker: string | null
                }
                Insert: {
                    comment?: number | null
                    created_at?: string
                    id?: number
                    liker?: string | null
                }
                Update: {
                    comment?: number | null
                    created_at?: string
                    id?: number
                    liker?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'comment_likes_comment_fkey'
                        columns: ['comment']
                        isOneToOne: false
                        referencedRelation: 'comments'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'comment_likes_liker_fkey'
                        columns: ['liker']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            comments: {
                Row: {
                    comment: string
                    commenter: string | null
                    created_at: string
                    id: number
                    post: string | null
                }
                Insert: {
                    comment: string
                    commenter?: string | null
                    created_at?: string
                    id?: number
                    post?: string | null
                }
                Update: {
                    comment?: string
                    commenter?: string | null
                    created_at?: string
                    id?: number
                    post?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'comments_commenter_fkey'
                        columns: ['commenter']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'comments_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                ]
            }
            customization: {
                Row: {
                    author: string
                    color: string
                    created_at: string
                    font_body: string
                    font_title: string
                    id: number
                    profile_layout: string | null
                    sidebar: boolean
                }
                Insert: {
                    author: string
                    color?: string
                    created_at?: string
                    font_body?: string
                    font_title?: string
                    id?: number
                    profile_layout?: string | null
                    sidebar?: boolean
                }
                Update: {
                    author?: string
                    color?: string
                    created_at?: string
                    font_body?: string
                    font_title?: string
                    id?: number
                    profile_layout?: string | null
                    sidebar?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: 'customization_author_fkey'
                        columns: ['author']
                        isOneToOne: true
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            draft_topics: {
                Row: {
                    created_at: string
                    draft: string | null
                    id: number
                    topic: string | null
                }
                Insert: {
                    created_at?: string
                    draft?: string | null
                    id?: number
                    topic?: string | null
                }
                Update: {
                    created_at?: string
                    draft?: string | null
                    id?: number
                    topic?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'draft_categories_category_fkey'
                        columns: ['topic']
                        isOneToOne: false
                        referencedRelation: 'topics'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'draft_categories_draft_fkey'
                        columns: ['draft']
                        isOneToOne: false
                        referencedRelation: 'drafts'
                        referencedColumns: ['id']
                    },
                ]
            }
            drafts: {
                Row: {
                    author: string | null
                    created_at: string
                    description: string | null
                    edited_at: string | null
                    estimatedReadingTime: number | null
                    id: string
                    image: string | null
                    json: Json | null
                    license: string | null
                    text: string | null
                    title: string
                }
                Insert: {
                    author?: string | null
                    created_at?: string
                    description?: string | null
                    edited_at?: string | null
                    estimatedReadingTime?: number | null
                    id?: string
                    image?: string | null
                    json?: Json | null
                    license?: string | null
                    text?: string | null
                    title: string
                }
                Update: {
                    author?: string | null
                    created_at?: string
                    description?: string | null
                    edited_at?: string | null
                    estimatedReadingTime?: number | null
                    id?: string
                    image?: string | null
                    json?: Json | null
                    license?: string | null
                    text?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'drafts_author_fkey'
                        columns: ['author']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            followers: {
                Row: {
                    created_at: string
                    follower: string
                    following: string
                    id: number
                }
                Insert: {
                    created_at?: string
                    follower: string
                    following: string
                    id?: number
                }
                Update: {
                    created_at?: string
                    follower?: string
                    following?: string
                    id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: 'followers_follower_fkey'
                        columns: ['follower']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'followers_following_fkey'
                        columns: ['following']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            hidden_authors: {
                Row: {
                    author: string | null
                    created_at: string
                    id: number
                    user_id: string
                }
                Insert: {
                    author?: string | null
                    created_at?: string
                    id?: number
                    user_id: string
                }
                Update: {
                    author?: string | null
                    created_at?: string
                    id?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'hidden_authors_author_fkey'
                        columns: ['author']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'hidden_authors_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            hidden_posts: {
                Row: {
                    created_at: string
                    id: number
                    post: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'public_hidden_posts_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'public_hidden_posts_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            likes: {
                Row: {
                    created_at: string
                    id: number
                    liker: string | null
                    post: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    liker?: string | null
                    post?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    liker?: string | null
                    post?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'public_likes_liker_fkey'
                        columns: ['liker']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'public_likes_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                ]
            }
            notification_settings: {
                Row: {
                    comments: string[]
                    comments_milestone: string[]
                    followers_milestone: string[]
                    following_post: string[]
                    id: number
                    likes: string[]
                    likes_milestone: string[]
                    new_follower: string[]
                    published_posts_milestones: string[]
                    scheduled_posts: string[]
                    user_id: string
                }
                Insert: {
                    comments?: string[]
                    comments_milestone?: string[]
                    followers_milestone?: string[]
                    following_post?: string[]
                    id?: number
                    likes?: string[]
                    likes_milestone?: string[]
                    new_follower?: string[]
                    published_posts_milestones?: string[]
                    scheduled_posts?: string[]
                    user_id: string
                }
                Update: {
                    comments?: string[]
                    comments_milestone?: string[]
                    followers_milestone?: string[]
                    following_post?: string[]
                    id?: number
                    likes?: string[]
                    likes_milestone?: string[]
                    new_follower?: string[]
                    published_posts_milestones?: string[]
                    scheduled_posts?: string[]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'public_notification_settings_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: true
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            notifications: {
                Row: {
                    avatar: string | null
                    created_at: string
                    id: string
                    notifier: string | null
                    post: string | null
                    read_at: string | null
                    type: string | null
                    user_id: string | null
                }
                Insert: {
                    avatar?: string | null
                    created_at?: string
                    id?: string
                    notifier?: string | null
                    post?: string | null
                    read_at?: string | null
                    type?: string | null
                    user_id?: string | null
                }
                Update: {
                    avatar?: string | null
                    created_at?: string
                    id?: string
                    notifier?: string | null
                    post?: string | null
                    read_at?: string | null
                    type?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'notifications_notifier_fkey'
                        columns: ['notifier']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notifications_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notifications_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            post_topics: {
                Row: {
                    post: string
                    topic: string
                }
                Insert: {
                    post: string
                    topic: string
                }
                Update: {
                    post?: string
                    topic?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'post_categories_category_fkey'
                        columns: ['topic']
                        isOneToOne: false
                        referencedRelation: 'topics'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'post_categories_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                ]
            }
            posts: {
                Row: {
                    author: string
                    comments_allowed: boolean
                    created_at: string
                    description: string | null
                    embeddings: string | null
                    estimatedReadingTime: number | null
                    featured: boolean
                    id: string
                    image: string | null
                    index: number
                    json: Json | null
                    license: string | null
                    mod_score: number
                    scheduled_at: string | null
                    text: string | null
                    title: string
                }
                Insert: {
                    author: string
                    comments_allowed?: boolean
                    created_at?: string
                    description?: string | null
                    embeddings?: string | null
                    estimatedReadingTime?: number | null
                    featured?: boolean
                    id?: string
                    image?: string | null
                    index?: number
                    json?: Json | null
                    license?: string | null
                    mod_score?: number
                    scheduled_at?: string | null
                    text?: string | null
                    title: string
                }
                Update: {
                    author?: string
                    comments_allowed?: boolean
                    created_at?: string
                    description?: string | null
                    embeddings?: string | null
                    estimatedReadingTime?: number | null
                    featured?: boolean
                    id?: string
                    image?: string | null
                    index?: number
                    json?: Json | null
                    license?: string | null
                    mod_score?: number
                    scheduled_at?: string | null
                    text?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'posts_author_fkey'
                        columns: ['author']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            reports: {
                Row: {
                    comment: number | null
                    created_at: string
                    id: number
                    message: string | null
                    post: string | null
                    reporter: string | null
                    type: string | null
                }
                Insert: {
                    comment?: number | null
                    created_at?: string
                    id?: number
                    message?: string | null
                    post?: string | null
                    reporter?: string | null
                    type?: string | null
                }
                Update: {
                    comment?: number | null
                    created_at?: string
                    id?: number
                    message?: string | null
                    post?: string | null
                    reporter?: string | null
                    type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'public_reports_comment_fkey'
                        columns: ['comment']
                        isOneToOne: false
                        referencedRelation: 'comments'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'public_reports_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'public_reports_reporter_fkey'
                        columns: ['reporter']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            topics: {
                Row: {
                    color: string | null
                    id: string
                    image: string | null
                    name: string | null
                }
                Insert: {
                    color?: string | null
                    id?: string
                    image?: string | null
                    name?: string | null
                }
                Update: {
                    color?: string | null
                    id?: string
                    image?: string | null
                    name?: string | null
                }
                Relationships: []
            }
            users: {
                Row: {
                    avatar: string | null
                    background: string | null
                    bio: string | null
                    created_at: string
                    email: string | null
                    facebook: string | null
                    github: string | null
                    id: string
                    index: number
                    instagram: string | null
                    linkedin: string | null
                    name: string
                    notifications: boolean | null
                    phone: string | null
                    tiktok: string | null
                    twitch: string | null
                    twitter: string | null
                    username: string | null
                    verified: boolean
                    website: string | null
                    youtube: string | null
                }
                Insert: {
                    avatar?: string | null
                    background?: string | null
                    bio?: string | null
                    created_at?: string
                    email?: string | null
                    facebook?: string | null
                    github?: string | null
                    id?: string
                    index?: number
                    instagram?: string | null
                    linkedin?: string | null
                    name?: string | null
                    notifications?: boolean | null
                    phone?: string | null
                    tiktok?: string | null
                    twitch?: string | null
                    twitter?: string | null
                    username?: string | null
                    verified?: boolean
                    website?: string | null
                    youtube?: string | null
                }
                Update: {
                    avatar?: string | null
                    background?: string | null
                    bio?: string | null
                    created_at?: string
                    email?: string | null
                    facebook?: string | null
                    github?: string | null
                    id?: string
                    index?: number
                    instagram?: string | null
                    linkedin?: string | null
                    name?: string | null
                    notifications?: boolean | null
                    phone?: string | null
                    tiktok?: string | null
                    twitch?: string | null
                    twitter?: string | null
                    username?: string | null
                    verified?: boolean
                    website?: string | null
                    youtube?: string | null
                }
                Relationships: []
            }
            watch_history: {
                Row: {
                    created_at: string
                    id: number
                    post: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: number
                    post?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'watch_history_post_fkey'
                        columns: ['post']
                        isOneToOne: false
                        referencedRelation: 'posts'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'watch_history_user_id_fkey'
                        columns: ['user_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            check_scheduled_posts: {
                Args: Record<PropertyKey, never>
                Returns: undefined
            }
            get_author_data:
                | {
                      Args: {
                          author_id: string
                      }
                      Returns: Json
                  }
                | {
                      Args: {
                          author_username: string
                      }
                      Returns: Json
                  }
            get_category_data: {
                Args: {
                    category_id: string
                }
                Returns: {
                    name: string
                    id: string
                    image: string
                    postcount: Json
                    post_categories: Json
                    color: string
                }[]
            }
            get_home_data:
                | {
                      Args: Record<PropertyKey, never>
                      Returns: {
                          id: string
                          title: string
                          image: string
                          created_at: string
                          author: Json
                          post_topics: Json[]
                          likecount: Json[]
                          commentcount: Json[]
                          bookmarkcount: Json[]
                      }[]
                  }
                | {
                      Args: {
                          current_user_uuid: string
                      }
                      Returns: {
                          popular_posts: Database['public']['CompositeTypes']['posttype'][]
                          most_followed_users: Database['public']['CompositeTypes']['authortype'][]
                          most_post_categories: Database['public']['CompositeTypes']['categorytype'][]
                      }[]
                  }
            get_or_create_categories: {
                Args: {
                    input_categories: string[]
                }
                Returns: {
                    color: string | null
                    id: string
                    image: string | null
                    name: string | null
                }[]
            }
            get_post_data:
                | {
                      Args: {
                          post_id: string
                      }
                      Returns: Json
                  }
                | {
                      Args: {
                          post_id: string
                          current_user_id: string
                      }
                      Returns: Json
                  }
            get_posts_in_category: {
                Args: {
                    category_id: string
                }
                Returns: {
                    name: string
                    id: string
                    image: string
                    postcount: Json
                    post_categories: Json
                    color: string
                }[]
            }
            hnswhandler: {
                Args: {
                    '': unknown
                }
                Returns: unknown
            }
            ivfflathandler: {
                Args: {
                    '': unknown
                }
                Returns: unknown
            }
            manage_categories: {
                Args: {
                    categories: string[]
                }
                Returns: Record<string, unknown>[]
            }
            manage_topics: {
                Args: {
                    topics: string[]
                }
                Returns: Record<string, unknown>[]
            }
            match_posts:
                | {
                      Args: {
                          query_embedding: string
                          match_threshold: number
                          match_count: number
                      }
                      Returns: {
                          id: string
                          title: string
                          created_at: string
                          description: string
                          likecount: Json
                          commentcount: Json
                          likes: Json
                          bookmarks: Json
                          image: string
                          author: Json
                          post_categories: Json
                          similarity: number
                      }[]
                  }
                | {
                      Args: {
                          query_embedding: string
                          match_threshold: number
                          match_count: number
                          filter_option: string
                      }
                      Returns: {
                          id: string
                          title: string
                          created_at: string
                          description: string
                          likecount: Json
                          commentcount: Json
                          likes: Json
                          bookmarks: Json
                          image: string
                          author: Json
                          post_topics: Json
                          similarity: number
                      }[]
                  }
            related_posts: {
                Args: {
                    post_id: string
                    match_threshold: number
                    match_count: number
                }
                Returns: {
                    id: string
                    title: string
                    created_at: string
                    description: string
                    likecount: Json
                    commentcount: Json
                    likes: Json
                    bookmarks: Json
                    image: string
                    author: Json
                    post_topics: Json
                    similarity: number
                }[]
            }
            vector_avg: {
                Args: {
                    '': number[]
                }
                Returns: string
            }
            vector_dims: {
                Args: {
                    '': string
                }
                Returns: number
            }
            vector_norm: {
                Args: {
                    '': string
                }
                Returns: number
            }
            vector_out: {
                Args: {
                    '': string
                }
                Returns: unknown
            }
            vector_send: {
                Args: {
                    '': string
                }
                Returns: string
            }
            vector_typmod_in: {
                Args: {
                    '': unknown[]
                }
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            authortype: {
                id: string | null
                name: string | null
                followercount: number | null
                isfollowing: boolean | null
                username: string | null
                bio: string | null
                website: string | null
                avatar: string | null
                postcount: number | null
                verified: boolean | null
            }
            categorytype: {
                name: string | null
                postcount: Json[] | null
                color: string | null
            }
            posttype: {
                id: string | null
                title: string | null
                image: string | null
                created_at: string | null
                estimatedreadingtime: number | null
                description: string | null
                text: string | null
                rawtext: string | null
                author: Json | null
                post_categories: Json[] | null
                likecount: Json[] | null
                commentcount: Json[] | null
                isliked: boolean | null
                isbookmarked: boolean | null
            }
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
            PublicSchema['Views'])
      ? (PublicSchema['Tables'] &
            PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
      ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
      ? PublicSchema['Enums'][PublicEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema['CompositeTypes']
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
      ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never
