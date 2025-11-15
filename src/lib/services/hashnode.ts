import { GraphQLClient, gql } from 'graphql-request'

interface CoverImage {
  url: string
}

interface Tag {
  name: string
}

export interface PostNode {
  id: string
  title: string
  brief: string
  publishedAt: string
  readTimeInMinutes: number
  coverImage?: CoverImage
  tags: Tag[]
  url: string
}

interface PostEdge {
  node: PostNode
}

interface PostsConnection {
  edges: PostEdge[]
}

interface Publication {
  posts: PostsConnection
}

interface HashnodeResponse {
  publication: Publication
}

const HASHNODE_API = 'https://gql.hashnode.com'
const USERNAME = 'ahmadkanaan'

const client = new GraphQLClient(HASHNODE_API)

export async function fetchBlogPosts(): Promise<PostNode[]> {
  const query = gql`
    query {
      publication(host: "${USERNAME}.hashnode.dev") {
        posts(first: 10) {
          edges {
            node {
              id
              title
              brief
              publishedAt
              readTimeInMinutes
              coverImage {
                url
              }
              tags {
                name
              }
              url
            }
          }
        }
      }
    }
  `

  const response = await client.request<HashnodeResponse>(query)
  return response.publication.posts.edges.map(edge => edge.node)
}